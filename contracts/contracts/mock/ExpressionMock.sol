pragma solidity 0.5.9;

contract ExpressionMock {
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
}
