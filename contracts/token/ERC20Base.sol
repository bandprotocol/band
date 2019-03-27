pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./ERC20Interface.sol";
import "../feeless/Feeless.sol";


contract ERC20Base is ERC20Interface, ERC20, Feeless, Ownable {

  function transferAndCall(address sender, address to, uint256 value, bytes4 sig, bytes memory data)
    public
    feeless(sender)
    returns (bool)
  {
    _transfer(sender, to, value);
    (bool success,) = to.call(abi.encodePacked(sig, uint256(sender), value, data));
    require(success);
    return true;
  }

  function transferFeeless(address sender, address to, uint256 value)
    public
    feeless(sender)
    returns (bool)
  {
    _transfer(sender, to, value);
    return true;
  }

  function mint(address to, uint256 value) public onlyOwner returns (bool) {
    _mint(to, value);
    return true;
  }

  function burn(address from, uint256 value) public onlyOwner returns (bool) {
    _burn(from, value);
    return true;
  }
}