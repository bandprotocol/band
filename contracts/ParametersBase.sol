pragma solidity 0.5.0;


/**
 * @title ParametersBase
 */
contract ParametersBase {
  /**
   * Public map of all active parameters.
   * This variable have to be declared first,
   * if not "delegatecall" will use another variable instead.
   */
  mapping (bytes32 => uint256) public params;
  /**
   * @dev Return the value at the given key. Throw if the value is not set.
   */
  function get(bytes32 key) public view returns (uint256) {
    uint256 value = params[key];
    require(value != 0);
    return value;
  }

  /**
   * @dev Similar to get function, but returns 0 instead of throwing.
   */
  function getZeroable(bytes32 key) public view returns (uint256) {
    return params[key];
  }
}
