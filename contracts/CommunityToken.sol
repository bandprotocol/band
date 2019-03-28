pragma solidity 0.5.0;

import "./token/SnapshotToken.sol";


contract CommunityToken is SnapshotToken {
  constructor(string memory name, string memory symbol, uint8 decimals)
    public ERC20Base(name, symbol, decimals)
  {}
}
