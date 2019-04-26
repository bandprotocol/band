pragma solidity 0.5.0;

import "./BandToken.sol";
import "./voting/CommitRevealVoting.sol";
import "./voting/SimpleVoting.sol";
import "./factory/BondingCurveFactory.sol";
import "./factory/CommunityTokenFactory.sol";
import "./factory/ParametersFactory.sol";
import "./factory/TCDFactory.sol";
import "./factory/TCRFactory.sol";


contract BandRegistryBase {
  // BAND Contracts
  BandToken public band;
  // Voting Contracts
  SimpleVoting public simpleVoting;
  CommitRevealVoting public commitRevealVoting;
  // Factory Contracts
  BondingCurveFactory public bondingCurveFactory;
  CommunityTokenFactory public communityTokenFactory;
  ParametersFactory public parametersFactory;
  TCDFactory public tcdFactory;
  TCRFactory public tcrFactory;
}
