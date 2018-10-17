pragma solidity ^0.4.24;


interface IBondingCurve {

  function inflate(uint256 _value, address _dest) external;
  function deflate(uint256 _value, address _src) external;

}
