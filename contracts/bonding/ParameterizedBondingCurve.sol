pragma solidity 0.5.0;

import "./BondingCurve.sol";
import "../Parameters.sol";


contract ParameterizedBondingCurve is BondingCurve {

  Parameters public params;

  constructor(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    uint256[] memory collateralExpressionTree,
    Parameters _params
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
    return params.getZeroable("curve:inflation_rate");
  }

  function getLiquidityFeeNumerator() public view returns (uint256) {
    return params.getZeroable("curve:liquidify_fee");
  }

  function setInflationRate(uint256) public {
    revert();
  }

  function setLiquidityFee(uint256) public {
    revert();
  }
}