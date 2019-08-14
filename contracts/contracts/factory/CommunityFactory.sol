pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../utils/Expression.sol";
import "../BandRegistry.sol";
import "./BondingCurveFactory.sol";
import "./CommunityTokenFactory.sol";
import "./ParametersFactory.sol";

contract CommunityFactory is Ownable {
  event CommunityCreated(
    CommunityToken token,
    BondingCurve bondingCurve,
    Parameters params
  );

  BandRegistry public registry;

  constructor(BandRegistry _registry) public {
    registry = _registry;
  }

  function create(
    string memory name,
    string memory symbol,
    Expression collateralExpression,
    uint256 bondingLiquiditySpread,
    uint256 paramsExpirationTime,
    uint256 paramsMinParticipationPct,
    uint256 paramsSupportRequiredPct
  ) public onlyOwner returns(CommunityToken,BondingCurve,Parameters) {
    CommunityToken token = CommunityTokenFactory.create(name, symbol);
    Parameters params = ParametersFactory.create(token);
    BondingCurve bondingCurve = BondingCurveFactory.create(registry.band(), token, params);
    token.addMinter(address(bondingCurve));
    token.addCapper(msg.sender);
    token.renounceMinter();
    token.renounceCapper();

    bytes32[] memory keys = new bytes32[](7);
    keys[0] = "bonding:liquidity_spread";
    keys[1] = "bonding:revenue_beneficiary";
    keys[2] = "bonding:inflation_rate";
    keys[3] = "bonding:curve_expression";
    keys[4] = "params:expiration_time";
    keys[5] = "params:min_participation_pct";
    keys[6] = "params:support_required_pct";

    uint256[] memory values = new uint256[](7);
    values[0] = bondingLiquiditySpread;
    values[1] = uint256(msg.sender);
    values[2] = 0;
    values[3] = uint256(address(collateralExpression));
    values[4] = paramsExpirationTime;
    values[5] = paramsMinParticipationPct;
    values[6] = paramsSupportRequiredPct;

    params.setRaw(keys,values);
    params.transferOwnership(msg.sender);
    emit CommunityCreated(token,bondingCurve,params);
    return (token,bondingCurve,params);
  }
}
