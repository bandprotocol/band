pragma solidity 0.5.9;

import "./token/ERC20Base.sol";
import  "./token/SnapshotToken.sol";
import "./token/LockableToken.sol";


/// "CommunityToken" is an ERC-20 token specific for each dataset community.
contract CommunityToken is SnapshotToken, LockableToken {
  constructor(string memory name, string memory symbol) public ERC20Base(name, symbol) {}
}
