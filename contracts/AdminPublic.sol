pragma solidity 0.5.0;

import "./AdminInterface.sol";


/**
 * @title AdminPublic
 */
contract AdminPublic is AdminInterface {
  /**
   * @dev Always return true everyone is an admin.
   */
  function isAdmin(address account) public view returns (bool) {
    return true;
  }
}
