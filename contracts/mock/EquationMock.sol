pragma solidity 0.5.0;

import "../Equation.sol";


/**
 * @dev Mock contract for testing Equation library using JavaScript tests
 */
contract EquationMock {
  using Equation for Equation.Node[];
  Equation.Node[] equation;

  constructor(uint256[] memory expressions) public {
    equation.init(expressions);
  }

  function getCollateralAt(uint256 supply) public view returns (uint256) {
    return equation.calculate(supply);
  }
}
