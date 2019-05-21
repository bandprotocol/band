pragma solidity 0.5.8;

import "./BondingCurve.sol";
import "../feeless/Feeless.sol";


contract ShortableBondingCurve is BondingCurve, Feeless {
  struct ShortSale {
    address owner;
    uint256 shortAmount;
    uint256 shortSaleCollateral;
    bool isOpen;
  }

  mapping (uint256 => ShortSale) shortSales;
  uint256 lastShortSaleIndex;

  uint256 totalShortTokens;
  uint256 shortMarginCallNumerator;

  function getBondingCurveSupplyPoint() public view returns (uint256) {
    return super.getBondingCurveSupplyPoint().sub(totalShortTokens);
  }

  function setShortMarginCall(uint256 _shortMarginCallNumerator) public onlyOwner {
    require(_shortMarginCallNumerator < RATIONAL_DENOMINATOR);
    shortMarginCallNumerator = _shortMarginCallNumerator;
  }

  function shortSellImpl(address seller, uint256 collateral, uint256 shortAmount)
    public
    requireToken(collateralToken, seller, collateral)
  {
    lastShortSaleIndex = lastShortSaleIndex.add(1);
    ShortSale storage shortSale = shortSales[lastShortSaleIndex];
    uint256 sellPrice = getSellPrice(shortAmount);
    shortSale.owner = seller;
    shortSale.shortAmount = shortAmount;
    shortSale.shortSaleCollateral = sellPrice.add(collateral);
    shortSale.isOpen = true;
    totalShortTokens = totalShortTokens.add(shortAmount);
    require(!_shouldMarginCall(shortSale));
  }

  function closePosition(address caller, uint256 shortSaleIndex)
    public
    feeless(caller)
  {
    ShortSale storage shortSale = shortSales[shortSaleIndex];
    require(shortSale.isOpen);
    require(caller == shortSale.owner);
    _closePosition(shortSale, caller);
  }

  function forceLiquidation(address caller, uint256 shortSaleIndex)
    public
    feeless(caller)
  {
    ShortSale storage shortSale = shortSales[shortSaleIndex];
    require(shortSale.isOpen);
    require(_shouldMarginCall(shortSale));
    _closePosition(shortSale, caller);
  }

  function _shouldMarginCall(ShortSale storage shortSale) internal view returns (bool) {
    uint256 totalSupply = super.getBondingCurveSupplyPoint();
    uint256 worstCaseBuyPrice = getCollateralAtSupply(totalSupply).sub(
      getCollateralAtSupply(totalSupply.sub(shortSale.shortAmount))
    );
    return (
      worstCaseBuyPrice.mul(RATIONAL_DENOMINATOR) >=
      shortSale.shortSaleCollateral.mul(shortMarginCallNumerator)
    );
  }

  function _closePosition(ShortSale storage shortSale, address caller) internal {
    require(shortSale.isOpen);
    shortSale.isOpen = false;
    uint256 shortAmount = shortSale.shortAmount;
    uint256 shortSaleCollateral = shortSale.shortSaleCollateral;
    uint256 buyPrice = getBuyPrice(shortAmount);
    totalShortTokens = totalShortTokens.sub(shortAmount);
    if (buyPrice < shortSaleCollateral) {
      currentCollateral = currentCollateral.add(buyPrice);
      collateralToken.transfer(caller, shortSaleCollateral.sub(buyPrice));
    } else {
      currentCollateral = currentCollateral.add(shortSaleCollateral);
      _adjustcurveMultiplier();
    }
  }
}
