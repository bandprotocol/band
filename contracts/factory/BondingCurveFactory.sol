pragma solidity 0.5.0;

import "../bonding/ParameterizedBondingCurve.sol";
import "../token/ERC20Interface.sol";
import "../Parameters.sol";


contract BondingCurveFactory {
  function create(
    ERC20Interface collateralToken,
    ERC20Interface bondedToken,
    uint256[] calldata collateralExpressionTree,
    Parameters params
  )
    external
    returns (BondingCurve)
  {
    BondingCurve curve = new ParameterizedBondingCurve(
      collateralToken,
      bondedToken,
      collateralExpressionTree,
      params
    );
    return curve;
  }
}