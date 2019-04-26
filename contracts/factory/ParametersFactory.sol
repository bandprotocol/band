pragma solidity 0.5.0;

import "../CommunityToken.sol";
import "../Parameters.sol";
import "../feeless/ExecutionDelegator.sol";


contract ParametersFactory{
  function create(
    CommunityToken token,
    VotingInterface voting,
    bytes32[] calldata keys,
    uint256[] calldata values
  )
    external
    returns (Parameters)
  {
    Parameters params = new Parameters(token, voting, keys, values);
    params.setExecDelegator(msg.sender);
    return params;
  }
}

