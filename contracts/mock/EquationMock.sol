pragma solidity ^0.4.24;

import "../Equation.sol";

/**
 * @dev Mock contract for testing Equation library using JavaScript tests
 */
contract EquationMock {
  using Equation for Equation.Data;
  Equation.Data equation;

  constructor(uint256[] expressions) public {
    equation.init(expressions);
  }

  function getPrice(uint256 supply) public view returns (uint256) {
    return equation.calculate(supply);
  }
}
