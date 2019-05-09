pragma solidity 0.5.0;

import "./BandRegistryBase.sol";
import "./CommunityCore.sol";
import "./feeless/ExecutionDelegator.sol";


contract BandRegistry is BandRegistryBase, ExecutionDelegator {
  event CommunityCreated(CommunityCore community);

  constructor(
  ) public {
    band = new BandToken();
    band.addMinter(msg.sender);
    exchange = new BandSimpleExchange(band);
    exchange.transferOwnership(msg.sender);
  }

  function createCommunity(
    string calldata name,
    string calldata symbol,
    ExpressionInterface collateralExpression,
    uint256 bondingLiquiditySpread,
    uint256 paramsExpirationTime,
    uint256 paramsMinParticipationPct,
    uint256 paramsSupportRequiredPct
  ) external {
    CommunityCore community = new CommunityCore(
      this,
      msg.sender,
      name,
      symbol,
      collateralExpression,
      bondingLiquiditySpread,
      paramsExpirationTime,
      paramsMinParticipationPct,
      paramsSupportRequiredPct
    );
    emit CommunityCreated(community);
  }
}
