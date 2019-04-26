pragma solidity 0.5.0;

import "./BandRegistryBase.sol";
import "./BandToken.sol";
import "./CommunityCore.sol";
import "./CommunityToken.sol";
import "./ParametersBase.sol";
import "./bonding/BondingCurve.sol";
import "./data/TCD.sol";
import "./data/TCR.sol";


contract CommunityCore {
  event TCDCreated(TCD tcd);
  event TCRCreated(TCR tcr);

  BandRegistryBase public registry;
  BandToken public band;
  CommunityToken public token;
  ParametersBase public params;
  BondingCurve public bondingCurve;

  constructor(
    BandRegistryBase _registry,
    string memory name,
    string memory symbol,
    uint256[] memory bondingCollateralEquation,
    uint256 bondingLiquidityFee,
    uint256 paramsExpirationTime,
    uint256 paramsMinParticipationPct,
    uint256 paramsSupportRequiredPct
  ) public {
    registry = _registry;
    band = _registry.band();
    token = _registry.communityTokenFactory().create(name, symbol);
    params = _registry.parametersFactory().create(token, _registry.simpleVoting());
    bondingCurve = _registry.bondingCurveFactory().create(
      band,
      token,
      bondingCollateralEquation,
      params
    );
    token.transferOwnership(address(bondingCurve));

    // commToken = _commToken;
    // params = _params;
    // bondingCurve = new ParameterizedBondingCurve(
    //   ERC20Interface(address(_bandToken)),
    //   ERC20Interface(address(_commToken)),
    //   _expressions,
    //   _params
    // );
  }

  function createTCD(
    uint256 minProviderStake,
    uint256 maxProviderCount,
    uint256 ownerRevenuePct,
    uint256 queryPrice
  ) external {
    // TODO
  }

  function createTCR(
    bytes8 prefix,
    uint256[] calldata decayFunction,
    uint256 minDeposit,
    uint256 applyStageLength,
    uint256 dispensationPercentage,
    uint256 commitTime,
    uint256 revealTime,
    uint256 minParticipationPct,
    uint256 supportRequiredPct
  ) external {
    // TODO
  }

  function convertEthToToken() public payable returns (uint256) {
    bondingCurve.inflate(msg.sender, msg.value);
    return msg.value;
  }
}
