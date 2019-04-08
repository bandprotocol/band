pragma solidity 0.5.0;

import "../plugins/RewardDistributor.sol";

contract RewardDistributorFactory {
  event RewardContractCreated(address rewardAddress);

  function create(ERC20Interface _token) external {
    RewardDistributor reward = new RewardDistributor(_token);
    emit RewardContractCreated(address(reward));
  }
}
