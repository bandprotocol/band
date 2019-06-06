pragma solidity 0.5.9;

import "./token/SnapshotToken.sol";
import "./token/LockableToken.sol";

contract CommunityToken is SnapshotToken, LockableToken {
  constructor(string memory name, string memory symbol)
    public ERC20Base(name, symbol) {}
}
