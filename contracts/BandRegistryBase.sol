pragma solidity 0.5.8;

import "./BandToken.sol";
import "./exchange/BandExchangeInterface.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract BandRegistryBase is Ownable {
  BandToken public band;
  BandExchangeInterface public exchange;
}
