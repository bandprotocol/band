pragma solidity 0.5.0;

import "./token/SnapshotToken.sol";


contract CommunityToken is SnapshotToken {
  using SafeMath for uint256;

  string public name;
  string public symbol;
  uint256 public decimals;

  constructor(string memory _name, string memory _symbol, uint8 _decimals) public {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
  }
}
