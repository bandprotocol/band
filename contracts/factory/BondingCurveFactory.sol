pragma solidity 0.5.8;

import "../exchange/ParameterizedBondingCurve.sol";
import "../token/ERC20Interface.sol";
import "../Parameters.sol";
import "../utils/Expression.sol";

library BondingCurveFactory {
  function create(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    Expression collateralExpression,
    Parameters params
  ) external returns (BondingCurve) {
    return new ParameterizedBondingCurve(collateralToken, bondedToken, collateralExpression, params);
  }
}
