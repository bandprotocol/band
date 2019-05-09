pragma solidity 0.5.0;

import "./BandToken.sol";
import "./BandSimpleExchange.sol";
import "./factory/BondingCurveFactory.sol";
import "./factory/CommunityTokenFactory.sol";
import "./factory/ParametersFactory.sol";
import "./factory/TCDFactory.sol";
import "./factory/TCRFactory.sol";


contract BandRegistryBase {
  // BAND Contracts
  BandToken public band;
  BandSimpleExchange public exchange;
}
