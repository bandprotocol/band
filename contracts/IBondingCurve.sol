pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Interface of BondingCurve contract. See BondingCurve.sol
 */
interface IBondingCurve {
  function getBandToken() external returns (IERC20);
  function getCommToken() external returns (IERC20);

  /**
   * @dev Deflate the community token by burning _value tokens for _dest.
   * curveMultiplier will adjust up to make sure the equation is consistent.
   */
  function deflate(uint256 _value) external;
}
