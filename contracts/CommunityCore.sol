pragma solidity 0.5.0;

import "./BandRegistryBase.sol";
import "./BandToken.sol";
import "./CommunityToken.sol";
import "./Parameters.sol";
import "./bonding/BondingCurve.sol";
import "./data/TCD.sol";
import "./data/TCR.sol";
import "./utils/KeyUtils.sol";


contract CommunityCore {
  using KeyUtils for bytes8;

  event TCDCreated(TCD tcd);
  event TCRCreated(TCR tcr);

  BandRegistryBase public registry;
  BandToken public band;
  CommunityToken public token;
  Parameters public params;
  BondingCurve public bondingCurve;

  TCD public tcd;
  mapping (bytes8 => TCR) public tcr;

  constructor(
    BandRegistryBase _registry,
    address creator,
    string memory name,
    string memory symbol,
    uint256[] memory bondingCollateralEquation,
    uint256 bondingLiquiditySpread,
    uint256 paramsExpirationTime,
    uint256 paramsMinParticipationPct,
    uint256 paramsSupportRequiredPct
  ) public {
    registry = _registry;
    band = _registry.band();
    token = CommunityTokenFactory.create(name, symbol);
    params = ParametersFactory.create(token, _registry.simpleVoting());
    bondingCurve = BondingCurveFactory.create(
      band,
      token,
      bondingCollateralEquation,
      params
    );
    token.setExecDelegator(address(_registry));
    params.setExecDelegator(address(_registry));
    token.addMinter(address(bondingCurve));
    token.renounceMinter();
    params.set("bonding:liquidity_spread", bondingLiquiditySpread);
    params.set("bonding:revenue_beneficiary", uint256(creator));
    params.set("params:expiration_time", paramsExpirationTime);
    params.set("params:min_participation_pct", paramsMinParticipationPct);
    params.set("params:support_required_pct", paramsSupportRequiredPct);
  }

  function createTCD(
    uint256 minProviderStake,
    uint256 maxProviderCount,
    uint256 ownerRevenuePct,
    uint256 queryPrice,
    uint256 withdrawDelay
  ) external {
    require(address(tcd) == address(0));
    params.set("data:min_provider_stake", minProviderStake);
    params.set("data:max_provider_count", maxProviderCount);
    params.set("data:owner_revenue_pct", ownerRevenuePct);
    params.set("data:query_price", queryPrice);
    params.set("data:withdraw_delay", withdrawDelay);
    tcd = TCDFactory.create(
      band, token, params, bondingCurve, registry.exchange()
    );
    token.addCapper(address(tcd));
    emit TCDCreated(tcd);
  }

  function createTCR(
    bytes8 prefix,
    uint256[] calldata decayFunction,
    uint256 minDeposit,
    uint256 applyStageLength,
    uint256 dispensationPercentage,
    uint256 commitTime,
    uint256 revealTime,
    uint256 minParticipationPct,
    uint256 supportRequiredPct
  ) external {
    require(prefix != bytes8("bonding:") && prefix != bytes8("params:") && prefix != bytes8("data:"));
    require(address(tcr[prefix]) == address(0));
    tcr[prefix] = TCRFactory.create(
      prefix, token, params, registry.commitRevealVoting(), decayFunction
    );
    params.set(prefix.append("min_deposit"), minDeposit);
    params.set(prefix.append("apply_stage_length"), applyStageLength);
    params.set(prefix.append("dispensation_percentage"), dispensationPercentage);
    params.set(prefix.append("commit_time"), commitTime);
    params.set(prefix.append("reveal_time"), revealTime);
    params.set(prefix.append("min_participation_pct"), minParticipationPct);
    params.set(prefix.append("support_required_pct"), supportRequiredPct);
    emit TCRCreated(tcr[prefix]);
  }
}
