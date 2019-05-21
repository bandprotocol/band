pragma solidity 0.5.8;

import "./BandRegistryBase.sol";
import "./CommunityCore.sol";


contract BandRegistry is BandRegistryBase {
  event CommunityCreated(CommunityCore community);
  event ExchangeSet(BandExchangeInterface exchange);

  constructor(
    BandToken _band,
    BandExchangeInterface _exchange
  ) public {
    band = _band;
    exchange = _exchange;
    emit ExchangeSet(exchange);
  }

  function setExchange(BandExchangeInterface _exchange) public onlyOwner {
    exchange = _exchange;
    emit ExchangeSet(exchange);
  }

  function createCommunity(
    string calldata name,
    string calldata symbol,
    Expression collateralExpression,
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
