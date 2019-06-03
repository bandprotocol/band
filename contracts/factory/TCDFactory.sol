pragma solidity 0.5.8;

import "../data/AggTCD.sol";

contract TCDFactory {
  event TCDCreated(TCDBase tcd, address creator);

  function createTCD(bytes8 prefix, BondingCurve bondingCurve, BandRegistry registry, Parameters params, bool isMedian)
    external returns (TCDBase)
  {
    TCDBase tcd;
    if (isMedian) tcd = new MedianAggTCD(prefix, bondingCurve, params, registry);
    else tcd = new MajorityAggTCD(prefix, bondingCurve, params, registry);
    LockableToken(address(params.token())).addCapper(address(tcd));
    emit TCDCreated(tcd, msg.sender);
    return tcd;
  }
}
