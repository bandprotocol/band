pragma solidity 0.5.0;


/**
 * @title ParametersInterface
 */
interface ParametersInterface {

  /**
   * @dev Return the value at the given key. Throw if the value is not set.
   */
  function get(bytes32 key) external view returns (uint256);

  /**
   * @dev Similar to get function, but returns 0 instead of throwing.
   */
  function getZeroable(bytes32 key) external view returns (uint256);
}
