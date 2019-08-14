pragma solidity 0.5.9;

interface WhiteListInterface {
  function verify(address reader) external view returns (bool);
}