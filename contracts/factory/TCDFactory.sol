pragma solidity 0.5.8;

import "../data/TCD.sol";

contract TCDFactory {
  event TCDCreated(TCD tcd, address creator);

  function createTCD(
    bytes8 prefix,
    BondingCurve bondingCurve,
    BandRegistry registry,
    Parameters params
  ) external returns(TCD) {
    TCD tcd = new TCD(prefix, bondingCurve, params, registry);
    LockableToken(address(params.token())).addCapper(address(tcd));
    emit TCDCreated(tcd, msg.sender);
    return tcd;
  }
}
