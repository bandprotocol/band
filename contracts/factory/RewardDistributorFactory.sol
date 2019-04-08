pragma solidity 0.5.0;

import "../plugins/RewardDistributor.sol";

contract RewardDistributorFactory {
  function create(ERC20Interface _token) external returns (RewardDistributor) {
    return new RewardDistributor(_token);
  }
}