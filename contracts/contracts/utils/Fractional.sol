pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/// "Fractional" library facilitate fixed point decimal computation. In Band Protocol, fixed point decimal can be
/// represented using `uint256` data type. The decimal is fixed at 18 digits and `mulFrac` can be used to multiply
/// the fixed point decimal with an ordinary `uint256` value.
library Fractional {
  using SafeMath for uint256;
  uint256 internal constant DENOMINATOR = 1e18;

  function getDenominator() internal pure returns (uint256) {
    return DENOMINATOR;
  }

  function mulFrac(uint256 numerator, uint256 value) internal pure returns(uint256) {
    return numerator.mul(value).div(DENOMINATOR);
  }
}
