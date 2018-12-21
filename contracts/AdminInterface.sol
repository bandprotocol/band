pragma solidity 0.4.24;


/**
 * @title AdminInterface
 */
interface AdminInterface {

  /**
   * @dev Return whether the given address is an admin at the moment.
   */
  function isAdmin(address account) external view returns (bool);
}
