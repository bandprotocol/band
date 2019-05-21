pragma solidity 0.5.8;

import "../data/TCD.sol";

library TCDFactory {
  function create(
    bytes8 prefix,
    BandToken band,
    CommunityToken token,
    Parameters params,
    BondingCurve bondingCurve,
    BandExchangeInterface exchange
  ) external returns (TCD) {
    return new TCD(prefix, band, token, params, bondingCurve, exchange);
  }
}
