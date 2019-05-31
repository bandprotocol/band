pragma solidity 0.5.8;

import "./BandToken.sol";
import "./exchange/BandExchangeInterface.sol";
import "./data/TCR.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./data/WhiteListInterface.sol";

contract BandRegistry is Ownable {
  event ExchangeSet(BandExchangeInterface exchange);

  BandToken public band;
  BandExchangeInterface public exchange;
  WhiteListInterface public whiteList;

  constructor(
    BandToken _band,
    BandExchangeInterface _exchange
  ) public {
    band = _band;
    exchange = _exchange;
    emit ExchangeSet(exchange);
  }

  function verify(address reader) public view returns (bool) {
    if (address(whiteList) == address(0)) {
      return true;
    }
    return whiteList.verify(reader);
  }

  function setWhiteList(WhiteListInterface _whiteList) public onlyOwner {
    whiteList = _whiteList;
  }

  function setExchange(BandExchangeInterface _exchange) public onlyOwner {
    exchange = _exchange;
    emit ExchangeSet(exchange);
  }
}
