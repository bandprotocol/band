pragma solidity ^0.4.24;


/**
 * @dev Interface of AdminTCR contract. See AdminTCR.sol
 */
interface IAdminTCR {
  function isAdmin(address _account) external view returns (bool);
}
