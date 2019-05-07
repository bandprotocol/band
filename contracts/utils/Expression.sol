pragma solidity 0.5.0;

import "./Equation.sol";


/// @title ExpressionInterface
interface ExpressionInterface {
  /// Return the result of evaluating the expression given a variable value
  function evaluate(uint256 x) external view returns (uint256);
}
