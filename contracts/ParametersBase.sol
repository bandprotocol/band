pragma solidity 0.5.0;


/**
 * @title ParametersBase
 */
contract ParametersBase {
  function get(bytes32 key) public view returns (uint256);
  function getZeroable(bytes32 key) public view returns (uint256);
}
