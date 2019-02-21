pragma solidity 0.5.0;


contract BandContractBase {

  // Denominator for any division
  uint256 public constant DENOMINATOR = 1e12;

  // 100*10^12 For percentage calculation in the contract
  uint256 public constant ONE_HUNDRED_PERCENT = 100 * DENOMINATOR;

  /**
   * @dev Helper modifier to only allow the function to be called from a
   * specific caller.
   */
  modifier onlyFrom(address caller) {
    require(msg.sender == caller);
    _;
  }
}
