pragma solidity 0.5.0;

import "../bonding/ParameterizedBondingCurve.sol";
import "../token/ERC20Interface.sol";
import "../Parameters.sol";
import "../utils/Expression.sol";


library BondingCurveFactory {
  function create(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    ExpressionInterface collateralExpression,
    Parameters params
  )
    external
    returns (BondingCurve)
  {
    BondingCurve curve = new ParameterizedBondingCurve(
      collateralToken,
      bondedToken,
      collateralExpression,
      params
    );
    return curve;
  }
}
