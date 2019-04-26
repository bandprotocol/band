pragma solidity 0.5.0;

import "./BandRegistryBase.sol";
import "./CommunityCore.sol";
import "./feeless/ExecutionDelegator.sol";


contract BandRegistry is BandRegistryBase, ExecutionDelegator {
  event CommunityCreated(CommunityCore community);

  constructor(
    SimpleVoting _simpleVoting,
    CommitRevealVoting _commitRevealVoting,
    BondingCurveFactory _bondingCurveFactory,
    CommunityTokenFactory _communityTokenFactory,
    ParametersFactory _parametersFactory,
    TCDFactory _tcdFactory,
    TCRFactory _tcrFactory
  ) public {
    band = new BandToken(msg.sender);
    simpleVoting = _simpleVoting;
    commitRevealVoting = _commitRevealVoting;
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
    uint256 bondingLiquiditySpread,
    uint256 paramsExpirationTime,
    uint256 paramsMinParticipationPct,
    uint256 paramsSupportRequiredPct
  ) external {
    CommunityCore community = new CommunityCore(
      this,
      name,
      symbol,
      bondingCollateralEquation,
      bondingLiquiditySpread,
      paramsExpirationTime,
      paramsMinParticipationPct,
      paramsSupportRequiredPct
    );
    emit CommunityCreated(community);
  }
}
