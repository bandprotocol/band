pragma solidity 0.5.0;

import "../CommunityToken.sol";


library CommunityTokenFactory {
  function create(string calldata name, string calldata symbol)
    external
    returns (CommunityToken)
  {
    CommunityToken token = new CommunityToken(name, symbol, 18);
    return token;
  }
}
