pragma solidity ^0.4.24;


contract Voting {

  enum VoteResult {
    Invalid,
    Yes,
    No,
    Inconclusive
  }

  function startPoll(uint8 yesThreshold, uint8 noThreshold) external;
}
