export const LOAD_REWARDS = 'LOAD_REWARDS'
export const ADD_REWARDS = 'ADD_REWARDS'
export const CLAIM_REWARD = 'CLAIM_REWARD'

export const loadRewards = address => ({
  type: LOAD_REWARDS,
  address,
})

export const addRewards = (address, rewards) => ({
  type: ADD_REWARDS,
  address,
  rewards,
})

export const claimReward = (address, rewardID) => ({
  type: CLAIM_REWARD,
  address,
  rewardID,
})
