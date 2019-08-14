pragma solidity 0.5.9;


interface BandExchangeInterface {
  function convertFromEthToBand() external payable returns (uint256);
}
