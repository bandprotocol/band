pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Interface of CommunityToken contract. See CommunityToken.sol
 */
contract /* interface */ ICommunityToken is IERC20 {
  /**
   * @dev see https://github.com/ethereum/EIPs/issues/20
   */
  function totalSupply() public view returns (uint256);

  function balanceOf(address who) public view returns (uint256);

  function allowance(address owner, address spender)
    public view returns (uint256);

  function transfer(address to, uint256 value) public returns (bool);

  function approve(address spender, uint256 value)
    public returns (bool);

  function transferFrom(address from, address to, uint256 value)
    public returns (bool);

  event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
  );

  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );

  /**
   * @dev additional mint/burn functions
   */
  function mint(address _account, uint256 _amount) public returns (bool);
  function burn(address _account, uint256 _amount) public returns (bool);
}
