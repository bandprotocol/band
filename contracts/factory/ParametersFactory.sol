pragma solidity 0.5.8;

import "../CommunityToken.sol";
import "../Parameters.sol";

library ParametersFactory {
  function create(CommunityToken token) external returns (Parameters) {
    return new Parameters(token);
  }
}
