pragma solidity ^0.4.24;


interface IAdminTCR {
  function isAdmin(address _account) external view returns (bool);
}
