pragma solidity 0.5.8;

import "../CommunityToken.sol";

library CommunityTokenFactory {
  function create(string calldata name, string calldata symbol) external returns (CommunityToken) {
    return new CommunityToken(name, symbol);
  }
}
