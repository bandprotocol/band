pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

library Fractional {
  using SafeMath for uint256;
  uint256 internal constant DENOMINATOR = 1e18;

  function getDenominator() internal pure returns (uint256) {
    return DENOMINATOR;
  }

  function multipliedBy(uint256 numerator, uint256 value) internal pure returns(uint256) {
    return numerator.mul(value).div(DENOMINATOR);
  }
}