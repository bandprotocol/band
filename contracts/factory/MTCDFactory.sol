pragma solidity 0.5.8;

import "../data/MultiSigTCD.sol";

contract MTCDFactory {
  event TCDCreated(MultiSigTCD mtcd, address creator);

  function createMultiSigTCD(bytes8 prefix, BondingCurve bondingCurve, BandRegistry registry, Parameters params)
    external returns (MultiSigTCD)
  {
    MultiSigTCD mtcd;
    mtcd = new MultiSigTCD(prefix, bondingCurve, params, registry);
    LockableToken(address(params.token())).addCapper(address(mtcd));
    emit TCDCreated(mtcd, msg.sender);
    return mtcd;
  }
}
