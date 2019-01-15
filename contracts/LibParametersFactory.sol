pragma solidity 0.5.0;

import "./CommunityToken.sol";
import "./Parameters.sol";

library LibParametersFactory{
  function createNewParameters(
    CommunityToken _token,
    Voting _voting,
    bytes32[] calldata keys,
    uint256[] calldata values
  )
    external
    returns(Parameters)
  {
    return new Parameters(_token, _voting, keys, values);
  }
}

