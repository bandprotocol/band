pragma solidity 0.5.9;

import "../data/OffchainAggTCD.sol";

contract OffchainAggTCDFactory {
  event OffchainAggTCDCreated(OffchainAggTCD mtcd, address creator);

  function createOffchainAggTCD(bytes8 prefix, BondingCurve bondingCurve, BandRegistry registry, Parameters params)
    external returns (OffchainAggTCD)
  {
    OffchainAggTCD otcd = new OffchainAggTCD(prefix, bondingCurve, params, registry);
    LockableToken(address(params.token())).addCapper(address(otcd));
    emit OffchainAggTCDCreated(otcd, msg.sender);
    return otcd;
  }
}
