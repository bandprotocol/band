pragma solidity ^0.4.24;

import "./IAdminTCR.sol";
import "./IBondingCurve.sol";


contract CommunityCore {

  IAdminTCR admin;
  IBondingCurve curve;

  constructor(IAdminTCR _admin, IBondingCurve _curve) public {
    admin = _admin;
    curve = _curve;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyAdmin() {
    require(admin.isAdmin(msg.sender));
    _;
  }
}
