pragma solidity 0.4.24;

import "./AdminInterface.sol";


/**
 * @title AdminSimple
 */
contract AdminSimple is AdminInterface {

  mapping (address => bool) admins;

  constructor() public {
    admins[msg.sender] = true;
  }

  function addAdmin(address account) public returns (bool) {
    require(isAdmin(msg.sender));
    admins[account] = true;
    return true;
  }

  function removeAdmin(address account) public returns (bool) {
    require(isAdmin(msg.sender));
    admins[account] = false;
    return true;
  }

  /**
   * @dev Return whether the given address is an admin at the moment.
   */
  function isAdmin(address account) public view returns (bool) {
    return admins[account];
  }
}
