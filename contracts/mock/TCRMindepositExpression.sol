pragma solidity 0.5.0;

import "../utils/Expression.sol";

/// @title TCRMinDepositExpression
contract TCRMinDepositExpression is ExpressionInterface {
  using Equation for Equation.Node[];
  Equation.Node[] public equation;

  constructor(uint256[] memory expressionTree) public {
    equation.init(expressionTree);
  }

  function evaluate(uint256 x) public view returns (uint256) {
    return equation.calculate(x);
  }
}
