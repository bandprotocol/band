pragma solidity 0.5.0;


/**
 * @title ResolveListener
 */
interface ResolveListener {

  enum PollState {
    Invalid,      // Invalid, no poll at this address/ID.
    Active,       // The poll is accepting commit/reveal.
    Yes,          // The poll is resolved, with result Yes.
    No,           // The poll is resolved, with result No.
    Inconclusive  // The poll is resolved, with result Inconclusive.
  }

  /**
   * @dev Call by Voting contract after a poll is resolved. The Callee should
   * make sure to only accept the call from its Voting contract.
   */
  function onResolved(uint256 pollID, PollState pollState) external returns (bool);
}
