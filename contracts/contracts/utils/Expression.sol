pragma solidity 0.5.9;

import "./Equation.sol";


interface Expression {
  /// Return the result of evaluating the expression given a variable value
  function evaluate(uint256 x) external view returns (uint256);
  function evaluateInv(uint256 v, uint256 lower, uint256 upper) external view returns (uint256);
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

  function evaluateInv(uint256 v, uint256 lower, uint256 upper) public view returns (uint256) {
    uint l = lower;
    uint r = upper;
    while (l < r) {
      uint256 m = (l + r + 1) / 2;
      uint256 val = evaluate(m);
      if (val > v) {
          r = m - 1;
      } else {
          l = m;
      }
    }
    return l;
  }
}
