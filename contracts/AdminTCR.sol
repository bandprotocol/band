pragma solidity ^0.4.24;

import "./IAdminTCR.sol";
import "./TCR.sol";


/**
 * @title AdminTCR
 *
 * @dev Admin TCR contract is a Token Curated Registry contract to keep track
 * of a particular community's admins. That is, the each data in TCR is an
 * Ethereum address.
 */
contract AdminTCR is IAdminTCR, TCR {

  /**
   * @dev Return whether the given address is an admin at the moment.
   */
  function isAdmin(address _account) external view returns (bool) {
    return isEntryValid(bytes32(_account));
  }

}
