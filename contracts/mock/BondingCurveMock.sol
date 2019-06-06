pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../exchange/BondingCurve.sol";
import "../Parameters.sol";
import "../utils/Expression.sol";


contract BondingCurveMock is Ownable, BondingCurve {
  uint256 internal _inflationRateNumerator;
  uint256 internal _liquiditySpreadNumerator;

  Expression public expression;

  constructor(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    Expression collateralExpression
  ) public BondingCurve(collateralToken,  bondedToken, Parameters(address(0))) {
    expression = collateralExpression;
  }

  function getRevenueBeneficiary() public view returns (address) {
    return owner();
  }

  function getInflationRateNumerator() public view returns (uint256) {
    return _inflationRateNumerator;
  }

  function getLiquiditySpreadNumerator() public view returns (uint256) {
    return _liquiditySpreadNumerator;
  }

  function getCollateralExpression() public view returns (Expression) {
    return expression;
  }

  function setExpression(Expression collateralExpression) public onlyOwner {
    expression = collateralExpression;
  }

  function setInflationRate(uint256 inflationRateNumerator) public onlyOwner {
    require(inflationRateNumerator < RATIONAL_DENOMINATOR);
    _inflationRateNumerator = inflationRateNumerator;
  }

  function setLiquiditySpread(uint256 liquiditySpreadNumerator) public onlyOwner {
    require(liquiditySpreadNumerator < RATIONAL_DENOMINATOR);
    _liquiditySpreadNumerator = liquiditySpreadNumerator;
  }
}
