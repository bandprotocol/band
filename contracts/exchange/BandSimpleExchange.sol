pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../utils/Fractional.sol";
import "./BandExchangeInterface.sol";

contract BandSimpleExchange is Ownable, BandExchangeInterface {
  using Fractional for uint256;

  BandToken public bandToken;
  uint256 public exchangeRate = 1e18;

  constructor(BandToken _bandToken) public {
    bandToken = _bandToken;
  }

  function setExchangeRate(uint256 newExchangeRate) public onlyOwner {
    exchangeRate = newExchangeRate;
  }

  function convertFromEthToBand() public payable returns (uint256) {
    address(uint160(owner())).transfer(msg.value);
    uint256 bandAmount = exchangeRate.mulFrac(msg.value);
    bandToken.transfer(address(msg.sender), bandAmount);
    return bandAmount;
  }
}
