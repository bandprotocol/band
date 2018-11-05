pragma solidity ^0.4.24;


/**
 * @dev Interface of Parameters contract. See Parameters.sol
 */
interface IParameters {
  function get(bytes32 key) external view returns (uint256);
  function getZeroable(bytes32 key) external view returns (uint256);
}
