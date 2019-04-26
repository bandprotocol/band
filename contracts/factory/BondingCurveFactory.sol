pragma solidity 0.5.0;

import "../bonding/ParameterizedBondingCurve.sol";
import "../token/ERC20Interface.sol";
import "../ParametersBase.sol";


contract BondingCurveFactory {
  function create(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    uint256[] calldata collateralExpressionTree,
    ParametersBase params
  )
    external
    returns (BondingCurve)
  {
    return new ParameterizedBondingCurve(
      collateralToken,
      bondedToken,
      collateralExpressionTree,
      params
    );
  }
}