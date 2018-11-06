pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./Proof.sol";


/**
 * @title Voting
 *
 * @dev Voting contract maintains voting power allocations of community members
 * as a Merkle tree. Anyone can send tokens to this contract to request voting
 * power. TCR and Parameters contracts use this tree to determine voting power.
 */
contract Voting {
  using SafeMath for uint256;
  using Proof for bytes32;

  // An event to emit when someone updates his/her voting power.
  event UpdateVote(address indexed voter, uint256 newPower);

  // An event to emit when someone commits vote to a poll.
  event CommitVote(uint256 indexed pollID, address indexed voter);

  enum VoteResult {
    Invalid,
    Yes,
    No,
    Inconclusive
  }

  struct Poll {
    uint256 commitEndTime;  // Experation timestamp of commit period
    uint256 revealEndTime;  // Experation timestamp of reveal period

    bytes32 powerSnapshot;  // Merkle hash of voting power at last commit

    uint8 yesThreshold;     // The percentage of votes for YES result
    uint8 noThreshold;      // The percentage of votes for NO result

    uint256 yesCount;       // The current total number of YES votes
    uint256 noCount;        // The current total number of NO votes

    mapping (address => bytes32) commits;
    mapping (address => uint256) weights;
    mapping (address => VoteResult) opinions;
  }


  uint256 nextPollNonce = 1;
  mapping (uint256 => Poll) public polls;

  // The Merkle root hash
  bytes32 public votingPowerRootHash;

  // The total voting power of all community members. That is, the total sum
  // of all leaves in votingPowerRootHash Merkle tree.
  uint256 public totalVotingPower;

  // Community token address.
  IERC20 public token;


  constructor(IERC20 _token) public {
    votingPowerRootHash = bytes32(0);
    token = _token;
  }

  /**
   * @dev Update voting power from oldPower to newPower. Voting contract will
   * update votingPowerRootHash accordingly.
   */
  function updateVotingPower(
    uint256 newPower,
    uint256 oldPower,
    bytes32[] proof
  )
    external
  {
    address voter = msg.sender;

    if (newPower < oldPower) {
      uint256 lessPower = oldPower.sub(newPower);
      require(token.transfer(voter, lessPower));
      totalVotingPower = totalVotingPower.sub(lessPower);
    } else {
      uint256 morePower = newPower.sub(oldPower);
      require(token.transferFrom(voter, this, morePower));
      totalVotingPower = totalVotingPower.add(morePower);
    }

    votingPowerRootHash = votingPowerRootHash.update(
      voter,
      bytes32(oldPower),
      bytes32(newPower),
      proof
    );

    emit UpdateVote(voter, newPower);
  }

  /**
   * @dev Commit vote to a particular poll, with commitValue. commitVote can
   * be called repeatedly until the commit period ends.
   */
  function commitVote(uint256 pollID, bytes32 commitValue) external {
    Poll storage poll = polls[pollID];

    require(poll.commitEndTime != 0);
    require(poll.commitEndTime > now);

    poll.commits[msg.sender] = commitValue;
    poll.powerSnapshot = votingPowerRootHash;

    emit CommitVote(pollID, msg.sender);
  }

  /**
   * @dev Reveal vote with choice and secret salt used in generating commit
   * earlier during the commit period.
   */
  function revealVote(
    uint256 pollID,
    bool isYes,
    uint256 salt,
    uint256 weight,
    bytes32[] proof
  )
    external
  {
    Poll storage poll = polls[pollID];
    address voter = msg.sender;

    require(poll.commitEndTime < now);
    require(poll.revealEndTime > now);
    require(poll.commits[voter] != bytes32(0));
    require(poll.weights[voter] == 0);

    require(keccak256(abi.encodePacked(isYes, salt)) == poll.commits[voter]);
    require(poll.powerSnapshot.verify(voter, bytes32(weight), proof));

    poll.weights[voter] = weight;
    poll.commits[voter] = bytes32(0);

    if (isYes) {
      poll.opinions[voter] = VoteResult.Yes;
      poll.yesCount += weight;
    } else {
      poll.opinions[voter] = VoteResult.No;
      poll.noCount += weight;
    }
  }

  function hasCommitted(uint256 pollID, address voter)
    public
    view
    returns (bool)
  {
    return polls[pollID].commits[voter] != bytes32(0);
  }

  function hasRevealed(uint256 pollID, address voter)
    public
    view
    returns (bool)
  {
    return polls[pollID].weights[voter] != 0;
  }

  /**
   * @dev Start a new poll. This function is to be called by TCR contracts
   * and will return the new poll's ID for future reference.
   */
  function startPoll(
    uint8 yesThreshold,
    uint8 noThreshold,
    uint256 commitTime,
    uint256 revealTime
  )
    public
    returns (uint256)
  {
    require(yesThreshold <= 100);
    require(noThreshold <= 100);

    uint256 nonce = nextPollNonce;
    nextPollNonce = nonce + 1;

    polls[nonce].commitEndTime = now + commitTime;
    polls[nonce].revealEndTime = now + commitTime + revealTime;
    polls[nonce].yesThreshold = yesThreshold;
    polls[nonce].noThreshold = noThreshold;

    return nonce;
  }

  /**
   * @dev Get the result of the given poll ID. Requires that the reveal period
   * must already end. The result can be Yes, No, or Inconclusive.
   */
  function getResult(uint256 pollID) public view returns (VoteResult) {
    Poll storage poll = polls[pollID];

    require(poll.revealEndTime < now);
    uint256 yesCount = poll.yesCount;
    uint256 noCount = poll.noCount;
    uint256 totalCount = yesCount.add(noCount);

    bool isYes = yesCount.mul(100) >= totalCount.mul(poll.yesThreshold);
    bool isNo = noCount.mul(100) >= totalCount.mul(poll.noThreshold);

    if (isYes && !isNo) {
      return VoteResult.Yes;
    }

    if (!isYes && isNo) {
      return VoteResult.No;
    }

    return VoteResult.Inconclusive;
  }

  /**
   * @dev Called by TCR contracts to get the total vote count for the given
   * vote result.
   */
  function getTotalVotes(uint256 pollID, VoteResult result)
    public
    view
    returns (uint256)
  {
    Poll storage poll = polls[pollID];
    if (result == VoteResult.Yes) {
      return poll.yesCount;
    } else if (result == VoteResult.No) {
      return poll.noCount;
    } else if (result == VoteResult.Inconclusive) {
      return poll.yesCount + poll.noCount;
    } else {
      assert(false);
    }
  }

  /**
   * @dev Called by TCR contracts to get the voting power contributed by
   * the given voter for a particular vote result.
   */
  function getUserVotes(uint256 pollID, address voter, VoteResult result)
    public
    view
    returns (uint256)
  {
    Poll storage poll = polls[pollID];
    if (result == VoteResult.Yes) {
      require(poll.opinions[voter] == VoteResult.Yes);
    } else if (result == VoteResult.No) {
      require(poll.opinions[voter] == VoteResult.No);
    } else if (result == VoteResult.Inconclusive) {
      // No verification needed on this branch
    } else {
      assert(false);
    }

    return poll.weights[voter];
  }
}
