pragma solidity ^0.4.24;

import "./TCR.sol";


/**
 * @title AdminTCR
 *
 * @dev Admin TCR contract is a Token Curated Registry contract to keep track
 * of a particular community's admins. That is, the each data in TCR is an
 * Ethereum address.
 */
contract AdminTCR is TCR {

  constructor(Parameters _params) TCR("admin", _params) public {}

  /**
   * @dev Return whether the given address is an admin at the moment.
   */
  function isAdmin(address account) public view returns (bool) {
    return entries[bytes32(account)].pendingExpiration > 0;
  }
}
