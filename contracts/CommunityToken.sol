pragma solidity 0.5.9;

import { ERC20Base } from "./token/ERC20Base.sol";
import { SnapshotToken } from  "./token/SnapshotToken.sol";
import { LockableToken } from "./token/LockableToken.sol";


/// "CommunityToken" is an ERC-20 token specific for each dataset community.
contract CommunityToken is SnapshotToken, LockableToken {
  constructor(string memory name, string memory symbol) public ERC20Base(name, symbol) {}
}
