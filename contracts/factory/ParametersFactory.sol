pragma solidity 0.5.0;

import "../CommunityToken.sol";
import "../Parameters.sol";
import "../feeless/ExecutionDelegator.sol";


library ParametersFactory {
  function create(CommunityToken token)
    external
    returns (Parameters)
  {
    Parameters params = new Parameters(token);
    return params;
  }
}

