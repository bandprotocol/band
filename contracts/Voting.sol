pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./Proof.sol";


contract Voting {
  using SafeMath for uint256;
  using Proof for bytes32;

  event UpdateVote(address indexed voter, uint256 newPower);
  event CommitVote(uint256 indexed pollID, address indexed voter);

  enum VoteResult {
    Invalid,
    Yes,
    No,
    Inconclusive
  }

  struct Poll {
    uint256 commitEndTime;
    uint256 revealEndTime;

    bytes32 powerSnapshot;

    uint8 yesThreshold;
    uint8 noThreshold;

    uint256 yesCount;
    uint256 noCount;

    mapping (address => bytes32) commits;
    mapping (address => uint256) weights;
    mapping (address => VoteResult) opinions;
  }


  uint256 nextPollNonce = 1;
  mapping (uint256 => Poll) public polls;

  // TODO
  bytes32 public votingPowerRootHash;

  // TODO
  uint256 public totalVotingPower;

  // TODO
  IERC20 public token;


  constructor(IERC20 _token) public {
    votingPowerRootHash = bytes32(0);
    token = _token;
  }

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

  function commitVote(uint256 pollID, bytes32 commitValue) external {
    Poll storage poll = polls[pollID];

    require(poll.commitEndTime != 0);
    require(poll.commitEndTime > now);

    poll.commits[msg.sender] = commitValue;

    emit CommitVote(pollID, msg.sender);
  }

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

    bytes32 powerSnapshot = poll.powerSnapshot;

    if (powerSnapshot == bytes32(0)) {
      powerSnapshot = votingPowerRootHash;
      poll.powerSnapshot = powerSnapshot;
    }

    require(keccak256(abi.encodePacked(isYes, salt)) == poll.commits[voter]);
    require(powerSnapshot.verify(voter, bytes32(weight), proof));

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
      // (:
    } else {
      assert(false);
    }

    return poll.weights[voter];
  }
}
