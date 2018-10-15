pragma solidity ^0.4.24;

import "./Equation.sol";

contract EquationMock{
  using Equation for Equation.Data;

  Equation.Data equation;

  function init(uint256[] expressions) public {
    equation.clear();
    equation.init(expressions);
  }

  function getPrice(uint256 supply) public view returns(uint256) {
    return equation.calculate(supply);
  }
}
