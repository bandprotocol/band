pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../token/ERC20Acceptor.sol";
import "../token/ERC20Interface.sol";
import "../utils/Expression.sol";
import "../utils/Fractional.sol";
import "../Parameters.sol";


contract BondingCurve is ERC20Acceptor {
  using SafeMath for uint256;
  using Fractional for uint256;

  event Buy(address indexed buyer, uint256 bondedTokenAmount, uint256 collateralTokenAmount);
  event Sell(address indexed seller, uint256 bondedTokenAmount, uint256 collateralTokenAmount);
  event Deflate(address indexed burner, uint256 burnedAmount);
  event RevenueCollect(address indexed beneficiary, uint256 bondedTokenAmount);

  ERC20Interface public collateralToken;
  ERC20Interface public bondedToken;
  Parameters public params;

  uint256 public currentMintedTokens;
  uint256 public currentCollateral;
  uint256 public lastInflationTime = now;

  constructor(ERC20Interface _collateralToken, ERC20Interface _bondedToken, Parameters _params) public {
    collateralToken = _collateralToken;
    bondedToken = _bondedToken;
    params = _params;
  }

  function getRevenueBeneficiary() public view returns (address) {
    address beneficiary = address(params.getRaw("bonding:revenue_beneficiary"));
    require(beneficiary != address(0));
    return beneficiary;
  }

  function getInflationRateNumerator() public view returns (uint256) {
    return params.getRaw("bonding:inflation_rate");
  }

  function getLiquiditySpreadNumerator() public view returns (uint256) {
    return params.getRaw("bonding:liquidity_spread");
  }

  function getCollateralExpression() public view returns (Expression) {
    return Expression(address(params.getRaw("bonding:curve_expression")));
  }

  function getCollateralAtSupply(uint256 tokenSupply) public view returns (uint256) {
    Expression collateralExpression = getCollateralExpression();
    uint256 collateralFromEquationAtCurrent = collateralExpression.evaluate(currentMintedTokens);
    uint256 collateralFromEquationAtSupply = collateralExpression.evaluate(tokenSupply);
    if (collateralFromEquationAtCurrent == 0) {
      return collateralFromEquationAtSupply;
    } else {
      return collateralFromEquationAtSupply.mul(currentCollateral).div(collateralFromEquationAtCurrent);
    }
  }

  function curveMultiplier() public view returns (uint256) {
    return currentCollateral.mul(Fractional.getDenominator()).div(getCollateralExpression().evaluate(currentMintedTokens));
  }

  function getBuyPrice(uint256 tokenValue) public view returns (uint256) {
    uint256 nextSupply = currentMintedTokens.add(tokenValue);
    return getCollateralAtSupply(nextSupply).sub(currentCollateral);
  }

  function getSellPrice(uint256 tokenValue) public view returns (uint256) {
    uint256 currentSupply = currentMintedTokens;
    require(currentSupply >= tokenValue);
    uint256 nextSupply = currentMintedTokens.sub(tokenValue);
    return currentCollateral.sub(getCollateralAtSupply(nextSupply));
  }

  modifier _adjustAutoInflation() {
    uint256 currentSupply = currentMintedTokens;
    if (lastInflationTime < now) {
      uint256 pastSeconds = now.sub(lastInflationTime);
      uint256 inflatingSupply = getInflationRateNumerator().mul(pastSeconds).mulFrac(currentSupply);
      if (inflatingSupply != 0) {
        currentMintedTokens = currentMintedTokens.add(inflatingSupply);
        _rewardBondingCurveOwner(inflatingSupply);
      }
    }
    lastInflationTime = now;
    _;
  }

  function buy(address buyer, uint256 priceLimit, uint256 buyAmount)
    public
    requireToken(collateralToken, buyer, priceLimit)
    _adjustAutoInflation
  {
    uint256 liquiditySpread = getLiquiditySpreadNumerator().mulFrac(buyAmount);
    uint256 totalMintAmount = buyAmount.add(liquiditySpread);
    uint256 buyPrice = getBuyPrice(totalMintAmount);
    require(buyPrice > 0 && buyPrice <= priceLimit);
    if (priceLimit > buyPrice) {
      require(collateralToken.transfer(buyer, priceLimit.sub(buyPrice)));
    }
    require(bondedToken.mint(buyer, buyAmount));
    if (liquiditySpread > 0) {
      _rewardBondingCurveOwner(liquiditySpread);
    }
    currentMintedTokens = currentMintedTokens.add(totalMintAmount);
    currentCollateral = currentCollateral.add(buyPrice);
    emit Buy(buyer, buyAmount, buyPrice);
  }

  function sell(address seller, uint256 sellAmount, uint256 priceLimit)
    public
    requireToken(bondedToken, seller, sellAmount)
    _adjustAutoInflation
  {
    uint256 sellPrice = getSellPrice(sellAmount);
    require(sellPrice > 0 && sellPrice >= priceLimit);
    require(bondedToken.burn(address(this), sellAmount));
    require(collateralToken.transfer(seller, sellPrice));
    currentMintedTokens = currentMintedTokens.sub(sellAmount);
    currentCollateral = currentCollateral.sub(sellPrice);
    emit Sell(seller, sellAmount, sellPrice);
  }

  function deflate(address burner, uint256 burnAmount) public requireToken(bondedToken, burner, burnAmount) {
    require(bondedToken.burn(address(this), burnAmount));
    currentMintedTokens = currentMintedTokens.sub(burnAmount);
    emit Deflate(burner, burnAmount);
  }

  function _rewardBondingCurveOwner(uint256 rewardAmount) internal {
    address beneficiary = getRevenueBeneficiary();
    require(bondedToken.mint(beneficiary, rewardAmount));
    emit RevenueCollect(beneficiary, rewardAmount);
  }
}
