pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../exchange/BondingCurve.sol";
import "../Parameters.sol";
import "../utils/Expression.sol";


contract BondingCurveInvertableMock is Ownable, BondingCurve {
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

  function testEval(uint256 y) public view returns (uint256) {
    return expression.evaluateInv(y);
  }

  function testEval2() public view returns (uint256) {
    return expression.evaluateInv(currentCollateral);
  }

  function getSupplyAtCollateral(uint256 tokenCollateral) public view returns (uint256) {
    uint256 supplyFromEquationAtCurrent = expression.evaluateInv(currentCollateral);
    uint256 supplyFromEquationAtSupply = expression.evaluateInv(tokenCollateral);
    if (supplyFromEquationAtCurrent == 0) {
      return supplyFromEquationAtSupply;
    } else {
      return supplyFromEquationAtSupply.mul(currentMintedTokens).div(supplyFromEquationAtCurrent);
    }
  }

  function getBuyPriceByCollateral(uint256 tokenCollateral) public view returns (uint256) {
    uint256 nextCollateral = currentCollateral.add(tokenCollateral);
    return getSupplyAtCollateral(nextCollateral).sub(currentMintedTokens);
  }

  function buyWithCollateral(address buyer, uint256 priceLimit, uint256 collateralAmount)
    public
    requireToken(collateralToken, buyer, collateralAmount)
    _adjustAutoInflation
  {
    uint256 buyAmount = getBuyPriceByCollateral(collateralAmount);
    require(buyAmount > 0 && priceLimit <= buyAmount);
    buyImpl(buyer, collateralAmount, buyAmount);
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
    require(inflationRateNumerator < 1e18);
    _inflationRateNumerator = inflationRateNumerator;
  }

  function setLiquiditySpread(uint256 liquiditySpreadNumerator) public onlyOwner {
    require(liquiditySpreadNumerator < 1e18);
    _liquiditySpreadNumerator = liquiditySpreadNumerator;
  }
}