pragma solidity ^0.4.24;


interface IParameters {

  function get(bytes32 key) external view returns (uint256);

}
