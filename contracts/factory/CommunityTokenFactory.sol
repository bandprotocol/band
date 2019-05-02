pragma solidity 0.5.0;

import "../CommunityToken.sol";


contract CommunityTokenFactory {
  function create(string calldata name, string calldata symbol)
    external
    returns (CommunityToken)
  {
    CommunityToken token = new CommunityToken(name, symbol, 18);
    token.addMinter(msg.sender);
    token.renounceMinter();
    return token;
  }
}
