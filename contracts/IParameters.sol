pragma solidity ^0.4.24;


interface IParameters {

  function get(string key) external view returns (uint256);
}
