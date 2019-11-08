pragma solidity 0.5.9;

contract ExpressionBinarySearch {

  function evaluate(uint256 x) public pure returns (uint256) {
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
    uint256 right = 2e25 - 1;
    uint256 left = 0;
    while (left < right) {
      uint256 mid = (left + right + 1) / 2;
      uint256 val = evaluate(mid);
      if (val > y) {
          right = mid - 1;
      } else {
          left = mid;
      }
    }
    return left;
  }
}
