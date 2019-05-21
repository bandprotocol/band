pragma solidity 0.5.8;

import "./BandRegistryBase.sol";
import "./BandToken.sol";
import "./factory/BondingCurveFactory.sol";
import "./factory/CommunityTokenFactory.sol";
import "./factory/ParametersFactory.sol";
import "./factory/TCDFactory.sol";
import "./factory/TCRFactory.sol";
import "./utils/Expression.sol";


contract CommunityCore {
  event TCDCreated(TCD tcd);
  event TCRCreated(TCR tcr);

  BandRegistryBase public registry;
  BandToken public band;
  CommunityToken public token;
  Parameters public params;
  BondingCurve public bondingCurve;

  constructor(
    BandRegistryBase _registry,
    address creator,
    string memory name,
    string memory symbol,
    Expression collateralExpression,
    uint256 bondingLiquiditySpread,
    uint256 paramsExpirationTime,
    uint256 paramsMinParticipationPct,
    uint256 paramsSupportRequiredPct
  ) public {
    registry = _registry;
    band = _registry.band();
    token = CommunityTokenFactory.create(name, symbol);
    params = ParametersFactory.create(token);
    bondingCurve = BondingCurveFactory.create(band, token, collateralExpression, params);
    token.setExecDelegator(address(_registry));
    token.addMinter(address(bondingCurve));
    token.renounceMinter();
    params.setExecDelegator(address(_registry));
    params.setRaw("bonding:liquidity_spread", bondingLiquiditySpread);
    params.setRaw("bonding:revenue_beneficiary", uint256(creator));
    params.setRaw("bonding:inflation_rate", 0);
    params.setRaw("params:expiration_time", paramsExpirationTime);
    params.setRaw("params:min_participation_pct", paramsMinParticipationPct);
    params.setRaw("params:support_required_pct", paramsSupportRequiredPct);
  }

  function createTCD(
    bytes8 prefix,
    uint256 minProviderStake,
    uint256 maxProviderCount,
    uint256 ownerRevenuePct,
    uint256 queryPrice,
    uint256 withdrawDelay
  ) external {
    params.set(prefix, "min_provider_stake", minProviderStake);
    params.set(prefix, "max_provider_count", maxProviderCount);
    params.set(prefix, "owner_revenue_pct", ownerRevenuePct);
    params.set(prefix, "query_price", queryPrice);
    params.set(prefix, "withdraw_delay", withdrawDelay);
    TCD tcd = TCDFactory.create(prefix, band, token, params, bondingCurve, registry.exchange());
    token.addCapper(address(tcd));
    emit TCDCreated(tcd);
  }

  function createTCR(
    bytes8 prefix,
    Expression decayFunction,
    uint256 minDeposit,
    uint256 applyStageLength,
    uint256 dispensationPercentage,
    uint256 commitTime,
    uint256 revealTime,
    uint256 minParticipationPct,
    uint256 supportRequiredPct
  ) external {
    params.set(prefix, "min_deposit", minDeposit);
    params.set(prefix, "apply_stage_length", applyStageLength);
    params.set(prefix, "dispensation_percentage", dispensationPercentage);
    params.set(prefix, "commit_time", commitTime);
    params.set(prefix, "reveal_time", revealTime);
    params.set(prefix, "min_participation_pct", minParticipationPct);
    params.set(prefix, "support_required_pct", supportRequiredPct);
    TCR tcr = TCRFactory.create(prefix, token, params, decayFunction);
    emit TCRCreated(tcr);
  }
}
