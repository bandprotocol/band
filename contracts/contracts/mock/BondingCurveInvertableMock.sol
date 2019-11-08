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

  function getBuyPriceByCollateral(uint256 tokenCollateral) public view returns (uint256) {
    require(tokenCollateral <= 1e26, "EXCEED_MAX_SUPPLY");
    uint256 r = 2e25 - 1;
    uint256 l = 0;
    while (l < r) {
      uint256 m = (l + r + 1) / 2;
      uint256 val = getBuyPrice(m);
      if (val > tokenCollateral) {
          r = m - 1;
      } else {
          l = m;
      }
    }
    return l;
  }

  function buyWithCollateral(address buyer, uint256 collateralAmount, uint256 priceLimit)
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
