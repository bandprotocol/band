pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./BandToken.sol";
import "./data/WhiteListInterface.sol";
import "./exchange/BandExchangeInterface.sol";


/// "BandRegistry" keeps the addresses of three main smart contracts inside of Band Protocol ecosystem:
///   1. "band" - Band Protocol's native ERC-20 token.
///   2. "exchange" - Decentralized exchange for converting ETH to Band and vice versa.
///   3. "whiteList" - Smart contract for validating non-malicious data consumers.
contract BandRegistry is Ownable {
  BandToken public band;
  BandExchangeInterface public exchange;
  WhiteListInterface public whiteList;

  constructor(BandToken _band, BandExchangeInterface _exchange) public {
    band = _band;
    exchange = _exchange;
  }

  function verify(address reader) public view returns (bool) {
    if (address(whiteList) == address(0)) return true;
    return whiteList.verify(reader);
  }

  function setWhiteList(WhiteListInterface _whiteList) public onlyOwner {
    whiteList = _whiteList;
  }

  function setExchange(BandExchangeInterface _exchange) public onlyOwner {
    exchange = _exchange;
  }
}
