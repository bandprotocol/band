pragma solidity ^0.4.24;


contract Voting {

  enum VoteResult {
    Invalid,
    Yes,
    No,
    Inconclusive
  }

  uint x;

  function requestVotingPower() external {
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
    uint256 commitDuration,
    uint256 revealDuration
  )
    public
    returns (uint256)
  {
    require(yesThreshold == noThreshold);
    require(commitDuration == revealDuration);
    x = 0;
    return 0;
  }

  function getVotingPowerSnapshot() public view returns (bytes32) {
    return bytes32(x);
  }

  function getResult() public view returns (VoteResult) {
    return VoteResult(x);
  }

  function getTotalWinningVotes(uint256 pollID) public view returns (uint256) {
    require(pollID == 0);
    return x;
  }

  function getUserWinningVotes(address voter, uint256 pollID)
    public
    view
    returns (uint256)
  {
    require(voter == address(0));
    require(pollID == 0);
    return x;
  }
}
