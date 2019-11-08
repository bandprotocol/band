pragma solidity 0.5.9;

import "./Equation.sol";


interface Expression {
  /// Return the result of evaluating the expression given a variable value
  function evaluate(uint256 x) external view returns (uint256);

  function evaluateInv(uint256 y) external view returns (uint256);
}


contract EquationExpression is Expression {
  using Equation for Equation.Node[];
  Equation.Node[] public equation;

  constructor(uint256[] memory expressionTree) public {
    equation.init(expressionTree);
  }

  function evaluate(uint256 x) public view returns (uint256) {
    return equation.calculate(x);
  }

  function evaluateInv(uint256 y) external view returns (uint256) {
    return y;
  }
}


contract BondingCurveExpression is EquationExpression {
  constructor(uint256[] memory expressionTree) public EquationExpression(expressionTree) {}
}


contract TCRMinDepositExpression is EquationExpression {
  constructor(uint256[] memory expressionTree) public EquationExpression(expressionTree) {}
}
