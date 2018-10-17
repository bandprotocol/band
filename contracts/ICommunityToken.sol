pragma solidity ^0.4.24;


interface ICommunityToken {
  /**
   * @dev see https://github.com/ethereum/EIPs/issues/20
   */
  function totalSupply() external view returns (uint256);

  function balanceOf(address who) external view returns (uint256);

  function allowance(address owner, address spender)
    external view returns (uint256);

  function transfer(address to, uint256 value) external returns (bool);

  function approve(address spender, uint256 value)
    external returns (bool);

  function transferFrom(address from, address to, uint256 value)
    external returns (bool);

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
  function mint(address _account, uint256 _amount) external returns (bool);
  function burn(address _account, uint256 _amount) external returns (bool);
}
