pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../exchange/BondingCurve.sol";


contract BondingCurveMock is Ownable, BondingCurve {
  uint256 internal _inflationRateNumerator;
  uint256 internal _liquiditySpreadNumerator;

  constructor(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    Expression collateralExpression
  ) public BondingCurve(collateralToken,  bondedToken, collateralExpression) {}

  function getRevenueBeneficiary() public view returns (address) {
    return owner();
  }

  function getInflationRateNumerator() public view returns (uint256) {
    return _inflationRateNumerator;
  }

  function getLiquiditySpreadNumerator() public view returns (uint256) {
    return _liquiditySpreadNumerator;
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
