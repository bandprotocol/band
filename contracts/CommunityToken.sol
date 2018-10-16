pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";


/**
 * @title CommunityToken
 *
 * @dev Template for community token in Band ecosystem. It is essentially an
 * ERC-20 contract with the ability for the "minter" to mint or burn tokens.
 * The minter will be the community's Curve contract after it is deployed.
 */
contract CommunityToken is MintableToken, DetailedERC20 {

  event Burn(address indexed burner, uint256 value);


  constructor(string _name, string _symbol, uint8 _decimals)
    public
    DetailedERC20(_name, _symbol, _decimals)
  {
  }

  /**
   * @dev Burns a specific amount of tokens. Must be called by the minter.
   * @param _who The owner of the tokens that will be burned.
   * @param _value The amount of token to be burned.
   */
  function burn(address _who, uint256 _value)
    public
    hasMintPermission
    returns (bool)
  {
    require(_value <= balances[_who]);
    // no need to require value <= totalSupply, since that would imply the
    // sender's balance is greater than the totalSupply, which *should* be
    // an assertion failure

    balances[_who] = balances[_who].sub(_value);
    totalSupply_ = totalSupply_.sub(_value);
    emit Burn(_who, _value);
    emit Transfer(_who, address(0), _value);

    return true;
  }
}
