pragma solidity 0.5.9;

import "./ERC20Interface.sol";


/// "ERC20Acceptor" is a utility smart contract that provides `requireToken` modifier for any contract that intends
/// to have functions that accept ERC-20 token transfer to inherit.
contract ERC20Acceptor {
  /// A modifer to decorate function that requires ERC-20 transfer. If called by ERC-20
  /// contract, the modifier trusts that the transfer already occurs. Otherwise, the modifier
  /// invokes 'transferFrom' to ensure that appropriate amount of tokens is paid properly.
  modifier requireToken(ERC20Interface token, address sender, uint256 amount) {
    if (msg.sender != address(token)) {
      require(sender == msg.sender);
      require(token.transferFrom(sender, address(this), amount));
    }
    _;
  }
}
