pragma solidity 0.5.0;

import "./BandRegistryBase.sol";
import "./CommunityCore.sol";


contract BandRegistry is BandRegistryBase {
  event CommunityCreated(CommunityCore community);

  constructor(
    BondingCurveFactory _bondingCurveFactory,
    CommunityTokenFactory _communityTokenFactory,
    ParametersFactory _parametersFactory,
    TCDFactory _tcdFactory,
    TCRFactory _tcrFactory
  ) public {
    band = new BandToken(msg.sender);
    simpleVoting = new SimpleVoting();
    commitRevealVoting = new CommitRevealVoting();
    bondingCurveFactory = _bondingCurveFactory;
    communityTokenFactory = _communityTokenFactory;
    parametersFactory = _parametersFactory;
    tcdFactory = _tcdFactory;
    tcrFactory = _tcrFactory;
  }

  function createCommunity(
    string calldata name,
    string calldata symbol,
    uint256[] calldata bondingCollateralEquation,
    uint256 bondingLiquidityFee,
    uint256 paramsExpirationTime,
    uint256 paramsMinParticipationPct,
    uint256 paramsSupportRequiredPct
  ) external {
    CommunityCore community = new CommunityCore(
      this,
      name,
      symbol,
      bondingCollateralEquation,
      bondingLiquidityFee,
      paramsExpirationTime,
      paramsMinParticipationPct,
      paramsSupportRequiredPct
    );
    emit CommunityCreated(community);
  }
}
