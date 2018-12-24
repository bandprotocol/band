pragma solidity 0.5.0;


/**
 * @title ResolveListener
 */
interface ResolveListener {

  /**
   * @dev Call by Voting contract after a poll is resolved. The Callee should
   * make sure to only accept the call from its Voting contract.
   */
  function onResolved(uint256 pollID) external returns (bool);
}
