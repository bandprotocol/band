pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./BancorPowerMinimal.sol";

contract ExpressionTalorSeries {
  using BancorPowerMinimal for uint256;

  function evaluate(uint256 x) external pure returns (uint256) {
    require(x < 2e25);
    uint256 result = 1e50;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    result = result * x / 2e25;
    return result / 488281250000000000000000;
  }

  function evaluateInv(uint256 y) external pure returns (uint256) {
    require(y <= 1e26, "EXCEED_MAX_SUPPLY");
    if (y == 0) {
      return 0;
    }
    (uint256 n, uint8 d) = (y + 1).power(1, 10);
    return (n*0x9e6fef9aecd2be38af5)/(1<<uint256(d));
  }
}
