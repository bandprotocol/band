pragma solidity 0.5.9;

import "../data/AggTCD.sol";

contract TCDFactory {
  event TCDCreated(AggTCD atcd, address creator);

  function createTCD(bytes8 prefix, BondingCurve bondingCurve, BandRegistry registry, Parameters params)
    external returns (AggTCD)
  {
    AggTCD atcd;
    atcd = new AggTCD(prefix, bondingCurve, params, registry);
    LockableToken(address(params.token())).addCapper(address(atcd));
    emit TCDCreated(atcd, msg.sender);
    return atcd;
  }
}
