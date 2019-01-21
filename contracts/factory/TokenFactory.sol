pragma solidity 0.5.0;

import "../CommunityToken.sol";


contract TokenFactory{
  function create(
    string calldata _name,
    string calldata _symbol,
    uint8 _decimals
  )
    external
    returns(CommunityToken)
  {
    CommunityToken token = new CommunityToken(_name, _symbol, _decimals);
    token.transferOwnership(msg.sender);
    return token;
  }
}

