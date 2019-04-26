pragma solidity 0.5.0;

import "./BondingCurve.sol";
import "../ParametersBase.sol";


contract ParameterizedBondingCurve is BondingCurve {

  ParametersBase public params;

  constructor(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    uint256[] memory collateralExpressionTree,
    ParametersBase _params
  )
    BondingCurve(collateralToken, bondedToken, collateralExpressionTree)
    public
  {
    params = _params;
  }

  function getRevenueBeneficiary() public view returns (address) {
    address beneficiary = address(params.getZeroable("curve:revenue_beneficary"));
    if (beneficiary == address(0)) {
      return super.getRevenueBeneficiary();
    } else {
      return beneficiary;
    }
  }

  function getInflationRateNumerator() public view returns (uint256) {
    return params.getZeroable("bonding:inflation_rate");
  }

  function getLiquiditySpreadNumerator() public view returns (uint256) {
    return params.getZeroable("bonding:liquidity_spread");
  }

  function setInflationRate(uint256) public {
    revert();
  }

  function setLiquidityFee(uint256) public {
    revert();
  }
}
