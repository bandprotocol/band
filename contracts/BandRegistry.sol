pragma solidity 0.5.8;

import "./BandRegistryBase.sol";

contract BandRegistry is BandRegistryBase {
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
}
