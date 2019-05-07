pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

import "./ERC20Interface.sol";
import "../feeless/Feeless.sol";


contract ERC20Base is ERC20Interface, ERC20, Feeless, MinterRole {
  string public name;
  string public symbol;
  uint8 public decimals = 18;

  constructor(string memory _name, string memory _symbol, uint8 _decimals) public {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
  }

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

  function mint(address to, uint256 value) public onlyMinter returns (bool) {
    _mint(to, value);
    return true;
  }

  function burn(address from, uint256 value) public onlyMinter returns (bool) {
    _burn(from, value);
    return true;
  }
}
