pragma solidity 0.5.0;

import "../CommunityToken.sol";
import "../Parameters.sol";
import "../feeless/ExecutionDelegator.sol";


contract ParametersFactory {
  function create(CommunityToken token, VotingInterface voting)
    external
    returns (Parameters)
  {
    Parameters params = new Parameters(token, voting);
    params.transferOwnership(msg.sender);
    return params;
  }
}

