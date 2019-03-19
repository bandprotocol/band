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

  function getInflationRateNumerator() public view returns (uint256) {
    return params.getZeroable("curve:inflation_rate");
  }

  function setInflationRate(uint256) public {
    revert();
  }

  function getLiquidityFeeNumerator() public view returns (uint256) {
    return params.getZeroable("curve:liquidify_fee");
  }

  function setLiquidityFee(uint256) public {
    revert();
  }
}