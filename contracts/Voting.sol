pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


contract Voting {
  using SafeMath for uint256;

  enum VoteResult {
    Invalid,
    Yes,
    No,
    Inconclusive
  }

  struct Poll {
    uint256 commitEndTime;
    uint256 revealEndTime;

    bytes32 votingPowerSnapshot;

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

  function revealVote() external {
    x = 0;
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
    require(noThreshold <= yesThreshold);
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

    if (yesCount.mul(100) >= totalCount.mul(poll.yesThreshold)) {
      return VoteResult.Yes;
    }

    if (yesCount.mul(100) < totalCount.mul(poll.noThreshold)) {
      return VoteResult.No;
    }

    return VoteResult.Inconclusive;
  }

  function getTotalVotes(uint256 pollID, VoteResult opinion)
    public
    view
    returns (uint256)
  {
    if (opinion == VoteResult.Yes) {
      return polls[pollID].yesCount;
    }

    if (opinion == VoteResult.No) {
      return polls[pollID].noCount;
    }

    return 0;
  }

  function getUserWinningVotes(
    uint256 pollID,
    address voter,
    VoteResult opinion
  )
    public
    view
    returns (uint256)
  {
    Poll storage poll = polls[pollID];

    require(poll.opinions[voter] == opinion);
    return poll.weights[voter];
  }
}
