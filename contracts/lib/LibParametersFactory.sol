pragma solidity 0.5.0;

import "../CommunityToken.sol";
import "../Parameters.sol";


library LibParametersFactory{
  function create(
    CommunityToken _token,
    VotingInterface _voting,
    bytes32[] calldata _keys,
    uint256[] calldata _values
  )
    external
    returns(Parameters)
  {
    return new Parameters(_token, _voting, _keys, _values);
  }
}

