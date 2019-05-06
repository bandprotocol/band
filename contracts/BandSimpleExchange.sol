pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./token/ERC20Acceptor.sol";

import "./utils/Fractional.sol";
import "./BandToken.sol";


contract BandSimpleExchange is Ownable, ERC20Acceptor {
  using Fractional for uint256;

  uint256 public exchangeRate = 1e18;
  BandToken public bandToken;

  constructor(BandToken _bandToken) public {
    bandToken = _bandToken;
  }

  function addBand(address sender, uint256 amount)
    public
    requireToken(bandToken, sender, amount)
  {
    require(sender == owner());
  }

  function setExchangeRate(uint256 newExchangeRate) public onlyOwner {
    exchangeRate = newExchangeRate;
  }

  function convertFromEthToBand()
    public payable
    returns(uint256)
  {
    address(uint160(owner())).transfer(msg.value);
    uint256 bandAmount = exchangeRate.mulFrac(msg.value);
    bandToken.transfer(address(msg.sender), bandAmount);
    return bandAmount;
  }
}
