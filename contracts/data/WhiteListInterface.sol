pragma solidity 0.5.8;

interface WhiteListInterface {
  function verify(address reader) external view returns (bool);
}