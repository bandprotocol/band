pragma solidity ^0.4.24;

import "./IAdminTCR.sol";
import "./TCR.sol";


contract AdminTCR is IAdminTCR, TCR {

  function isAdmin(address _account) external view returns (bool) {
    return isEntryValid(bytes32(_account));
  }
}
