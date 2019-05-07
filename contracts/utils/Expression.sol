pragma solidity 0.5.0;

import "./Equation.sol";


/// @title ExpressionInterface
interface ExpressionInterface {
  /// Return the result of evaluating the expression given a variable value
  function eval(uint256 x) external view returns (uint256);
}


/// @title TODO
contract TODO is ExpressionInterface {
  using Equation for Equation.Node[];
  Equation.Node[] public equation;

  constructor(uint256[] memory expressionTree) public {
    equation.init(expressionTree);
  }

  function eval(uint256 x) public view returns (uint256) {
    return equation.calculate(x);
  }
}
