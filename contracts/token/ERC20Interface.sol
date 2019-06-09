pragma solidity 0.5.9;


interface ERC20Interface {
  // Standard ERC-20 interface.
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address who) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);
  // Extension of ERC-20 interface to support supply adjustment.
  function mint(address to, uint256 value) external returns (bool);
  function burn(address from, uint256 value) external returns (bool);
}
