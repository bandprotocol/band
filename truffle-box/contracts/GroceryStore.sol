pragma solidity 0.5.10;

import {BandLib, usingBand, Oracle} from "band-solidity/contracts/data/BandLib.sol";

contract GroceryStore is usingBand {
  using BandLib for Oracle;

  struct Receipt{
    uint256 priceInUSD;
    uint256 payEth;
    uint256 timestamp;
  }

  mapping(address => Receipt) public lastPay;

  function pay(uint256 priceInUSD) public payable {
    uint256 ethUsd = CRYPTO.queryUint256("ETH/USD");
    uint256 price = priceInUSD * 1e36 / ethUsd;
    require(msg.value >= price);
    lastPay[msg.sender] = Receipt(priceInUSD, msg.value, now);
  }
}
