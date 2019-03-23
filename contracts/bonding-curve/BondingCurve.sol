pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "../Equation.sol";
import "../token/ERC20Acceptor.sol";
import "../token/ERC20Interface.sol";


/**
 * @title BondingCurve
 */
contract BondingCurve is Ownable, ERC20Acceptor {
  using Equation for Equation.Node[];
  using SafeMath for uint256;

  event Buy(
    address indexed buyer,
    uint256 bondedTokenAmount,
    uint256 collateralTokenAmount
  );

  event Sell(
    address indexed seller,
    uint256 bondedTokenAmount,
    uint256 collateralTokenAmount
  );

  event Deflate(
    address indexed burner,
    uint256 burnedAmount
  );

  event RevenueCollect(
    address indexed beneficiary,
    uint256 bondedTokenAmount
  );

  event CurveMultiplierChange(
    uint256 previousValue,
    uint256 nextValue
  );

  ERC20Interface public collateralToken;
  ERC20Interface public bondedToken;
  Equation.Node[] public collateralEquation;

  uint256 public currentMintedTokens;
  uint256 public currentCollateral;
  uint256 public curveMultiplier = 1e18;
  uint256 public lastInflationTime = now;

  uint256 internal _inflationRateNumerator;
  uint256 internal _liquidityFeeNumerator;
  uint256 public constant RATIONAL_DENOMINATOR = 1e18;

  constructor(
    ERC20Interface _collateralToken,
    ERC20Interface _bondedToken,
    uint256[] memory collateralExpressionTree
  ) public {
    collateralToken = _collateralToken;
    bondedToken = _bondedToken;
    collateralEquation.init(collateralExpressionTree);
    emit CurveMultiplierChange(0, curveMultiplier);
  }

  function getCollateralAtSupply(uint256 tokenSupply) public view returns (uint256) {
    uint256 collateralFromEquation = collateralEquation.calculate(tokenSupply);
    return collateralFromEquation.mul(curveMultiplier).div(RATIONAL_DENOMINATOR);
  }

  function getBondingCurveSupplyPoint() public view returns (uint256) {
    return currentMintedTokens;
  }

  function getBuyPrice(uint256 tokenValue) public view returns (uint256) {
    uint256 nextSupply = getBondingCurveSupplyPoint().add(tokenValue);
    return getCollateralAtSupply(nextSupply).sub(currentCollateral);
  }

  function getSellPrice(uint256 tokenValue) public view returns (uint256) {
    uint256 currentSupply = getBondingCurveSupplyPoint();
    require(currentSupply >= tokenValue);
    uint256 nextSupply = getBondingCurveSupplyPoint().sub(tokenValue);
    return currentCollateral.sub(getCollateralAtSupply(nextSupply));
  }

  function getRevenueBeneficiary() public view returns (address) {
    return owner();
  }

  function getInflationRateNumerator() public view returns (uint256) {
    return _inflationRateNumerator;
  }

  function getLiquidityFeeNumerator() public view returns (uint256) {
    return _liquidityFeeNumerator;
  }

  function setInflationRate(uint256 inflationRateNumerator) public onlyOwner {
    require(inflationRateNumerator < RATIONAL_DENOMINATOR);
    _inflationRateNumerator = inflationRateNumerator;
  }

  function setLiquidityFee(uint256 liquidityFeeNumerator) public onlyOwner {
    require(liquidityFeeNumerator < RATIONAL_DENOMINATOR);
    _liquidityFeeNumerator = liquidityFeeNumerator;
  }

  function buy(address buyer, uint256 priceLimit, uint256 buyAmount)
    public
    requireToken(collateralToken, buyer, priceLimit)
  {
    _adjustAutoInflation();
    uint256 liquidityFee = buyAmount.mul(getLiquidityFeeNumerator()).div(RATIONAL_DENOMINATOR);
    uint256 totalMintAmount = buyAmount.add(liquidityFee);
    uint256 buyPrice = getBuyPrice(totalMintAmount);
    require(buyPrice > 0 && buyPrice <= priceLimit);
    if (priceLimit > buyPrice) {
      require(collateralToken.transfer(buyer, priceLimit.sub(buyPrice)));
    }
    require(bondedToken.mint(buyer, buyAmount));
    if (liquidityFee > 0) {
      _rewardBondingCurveOwner(liquidityFee);
    }
    currentMintedTokens = currentMintedTokens.add(totalMintAmount);
    currentCollateral = currentCollateral.add(buyPrice);
    emit Buy(buyer, buyAmount, buyPrice);
  }

  function sell(address seller, uint256 sellAmount, uint256 priceLimit)
    public
    requireToken(bondedToken, seller, sellAmount)
  {
    _adjustAutoInflation();
    uint256 sellPrice = getSellPrice(sellAmount);
    require(sellPrice > 0 && sellPrice >= priceLimit);
    require(bondedToken.burn(address(this), sellAmount));
    require(collateralToken.transfer(seller, sellPrice));
    currentMintedTokens = currentMintedTokens.sub(sellAmount);
    currentCollateral = currentCollateral.sub(sellPrice);
    emit Sell(seller, sellAmount, sellPrice);
  }

  function deflate(address burner, uint256 burnAmount)
    public
    requireToken(bondedToken, burner, burnAmount)
  {
    require(bondedToken.burn(address(this), burnAmount));
    currentMintedTokens = currentMintedTokens.sub(burnAmount);
    _adjustcurveMultiplier();
    emit Deflate(burner, burnAmount);
  }

  function _rewardBondingCurveOwner(uint256 rewardAmount) internal {
    address beneficiary = getRevenueBeneficiary();
    require(bondedToken.mint(beneficiary, rewardAmount));
    emit RevenueCollect(beneficiary, rewardAmount);
  }

  function _adjustAutoInflation() internal {
    uint256 currentSupply = getBondingCurveSupplyPoint();
    if (currentSupply != 0 && lastInflationTime < now) {
      uint256 pastSeconds = now.sub(lastInflationTime);
      uint256 inflatingSupply = currentSupply
        .mul(pastSeconds).mul(getInflationRateNumerator()).div(RATIONAL_DENOMINATOR);
      if (inflatingSupply != 0) {
        currentMintedTokens = currentMintedTokens.add(inflatingSupply);
        _rewardBondingCurveOwner(inflatingSupply);
        _adjustcurveMultiplier();
      }
    }
    lastInflationTime = now;
  }

  function _adjustcurveMultiplier() internal {
    uint256 collateralRaw = collateralEquation.calculate(getBondingCurveSupplyPoint());
    require(currentCollateral >= 0);
    require(collateralRaw >= 0);
    uint256 nextCurveMultiplier = RATIONAL_DENOMINATOR.mul(currentCollateral).div(collateralRaw);
    if (curveMultiplier != nextCurveMultiplier) {
      emit CurveMultiplierChange(curveMultiplier, nextCurveMultiplier);
      curveMultiplier = nextCurveMultiplier;
    }
  }
}
