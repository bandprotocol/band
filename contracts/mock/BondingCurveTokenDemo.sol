pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../Equation.sol";


/**
 * @author Band Protocol
 *
 * @dev Example contract to illustrate Band Protocol's Equation Library.
 * DO NOT USE IT IN PRODUCTION. The contract is not fully auditted, and
 * is likely susceptible to common attacks such as front running. 
 */
contract BondingCurveDemoToken is ERC20 {
  using Equation for Equation.Node[];
  using SafeMath for uint256;

  string public constant name = "BondingCurveDemoToken";
  string public constant symbol = "BCDT";
  uint256 public constant decimals = 18;

  // Equation of the collateral bonding curve that controls how this contract
  // issues new tokens to the system.
  Equation.Node[] equation;

  constructor(uint256[] memory expressions) public {
    equation.init(expressions);
  }

  /**
   * @dev Buy 'amount' of BCDT with ether. Excessive ether will get refunded.
   */
  function buy(uint256 amount) public payable {
    uint256 collateralChange = equation.calculate(
      totalSupply().add(amount)
    ).sub(equation.calculate(
      totalSupply())
    );
    require(msg.value >= collateralChange);
    _mint(msg.sender, amount);
    if (msg.value > collateralChange) {
      msg.sender.transfer(msg.value.sub(collateralChange));
    }
  }
  
  /**
   * @dev Sell 'amount' of BCDT back to ether.
   */
  function sell(uint256 amount) public {
    require(balanceOf(msg.sender) >= amount);
    uint256 collateralChange = equation.calculate(
      totalSupply()
    ).sub(equation.calculate(
      totalSupply().sub(amount))
    );
    _burn(msg.sender, amount);
    msg.sender.transfer(collateralChange);
  }
}
