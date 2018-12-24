pragma solidity 0.5.0;


/**
 * @title AdminInterface
 */
interface AdminInterface {

  /**
   * @dev Return whether the given address is an admin at the moment.
   */
  function isAdmin(address account) external view returns (bool);
}
