pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


/**
 * @title CommunityToken
 *
 * @dev Template for community token in Band ecosystem. It is essentially an
 * ERC-20 contract with the ability for the "minter" to mint or burn tokens.
 * The minter will be the community's Curve contract after it is deployed.
 */
contract CommunityToken is ERC20, Ownable {

  string public name;
  string public symbol;
  uint256 public decimals;

  constructor(string _name, string _symbol, uint8 _decimals) public {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
  }

  function mint(address _account, uint256 _amount) public onlyOwner {
    _mint(_account, _amount);
  }

  function burn(address _account, uint256 _amount) public onlyOwner {
    _burn(_account, _amount);
  }
}
