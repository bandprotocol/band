pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


interface IBondingCurve {

  function getBandToken() external returns (IERC20);
  function getCommToken() external returns (IERC20);

  function inflate(uint256 _value, address _dest) external;
  function deflate(uint256 _value, address _src) external;

}
