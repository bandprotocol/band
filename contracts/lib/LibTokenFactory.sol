pragma solidity 0.5.0;

import "../CommunityToken.sol";


library LibTokenFactory{
  function create(
    string calldata _name,
    string calldata _symbol,
    uint8 _decimals
  )
    external
    returns(CommunityToken)
  {
    return new CommunityToken(_name, _symbol, _decimals);
  }
}

