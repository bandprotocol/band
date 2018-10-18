pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./VerifyProof.sol";


contract Voting {
  using SafeMath for uint256;
  using SMTProofVerifier for bytes32;

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
  mapping (uint256 => Poll) polls;

  // TODO
  bytes32 public votingPowerRootHash;

  // TODO
  uint256 public totalVotingPower;

  // TODO
  IERC20 public token;

  uint x;

  constructor(address _token) public {
    votingPowerRootHash = bytes32(0);
    token = IERC20(_token);
  }

  function requestVotingPower() external {
    x = 0;
  }

  function withdrawVotingPower() external {
    x = 0;
  }

  function commitVote() external {
    x = 0;
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

    require(poll.revealEndTime > now);
    require(poll.commits[voter] != bytes32(0));
    require(poll.weights[voter] == 0);

    require(keccak256(abi.encodePacked(isYes, salt)) == poll.commits[voter]);
    require(poll.powerSnapshot.verifyProof(voter, bytes32(weight), proof));

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
    uint256 commitEndTime,
    uint256 revealEndTime
  )
    public
    returns (uint256)
  {
    require(yesThreshold <= 100);
    require(noThreshold <= 100);
    require(commitEndTime <= revealEndTime);

    uint256 nonce = nextPollNonce;
    nextPollNonce = nonce + 1;

    polls[nonce].commitEndTime = commitEndTime;
    polls[nonce].revealEndTime = revealEndTime;
    polls[nonce].yesThreshold = yesThreshold;
    polls[nonce].noThreshold = noThreshold;
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

  function getTotalVotes(uint256 pollID, bool isYes)
    public
    view
    returns (uint256)
  {
    if (isYes) {
      return polls[pollID].yesCount;
    } else {
      return polls[pollID].noCount;
    }
  }

  function getUserWinningVotes(uint256 pollID, address voter, bool isYes)
    public
    view
    returns (uint256)
  {
    Poll storage poll = polls[pollID];

    if (isYes) {
      require(poll.opinions[voter] == VoteResult.Yes);
    } else {
      require(poll.opinions[voter] == VoteResult.No);
    }

    return poll.weights[voter];
  }
}
