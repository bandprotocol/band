pragma solidity 0.5.0;

import "../CommunityToken.sol";


contract TokenFactory{
  function create(string calldata _name, string calldata _symbol)
    external
    returns (CommunityToken)
  {
    CommunityToken token = new CommunityToken(_name, _symbol, 18);
    token.setExecDelegator(msg.sender);
    token.transferOwnership(msg.sender);
    return token;
  }
}
