pragma solidity 0.5.8;

import "./BondingCurve.sol";
import "../Parameters.sol";

contract ParameterizedBondingCurve is BondingCurve {

  Parameters public params;

  constructor(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    Expression collateralExpression,
    Parameters _params
  )
    BondingCurve(collateralToken, bondedToken, collateralExpression)
    public
  {
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
}
