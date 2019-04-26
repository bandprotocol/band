pragma solidity 0.5.0;

import "../CommunityToken.sol";
import "../ParametersBase.sol";
import "../data/TCD.sol";

contract TCDFactory {
  function create(CommunityToken token, ParametersBase params) external returns (TCD) {
    return new TCD(token, params);
  }
}