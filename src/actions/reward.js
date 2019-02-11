export const LOAD_REWARDS = 'LOAD_REWARDS'
export const ADD_REWARDS = 'ADD_REWARDS'
export const CLAIM_REWARD = 'CLAIM_REWARD'

export const loadRewards = name => ({
  type: LOAD_REWARDS,
  name,
})

export const addRewards = (name, rewards) => ({
  type: ADD_REWARDS,
  name,
  rewards,
})

export const claimReward = (name, rewardID) => ({
  type: CLAIM_REWARD,
  name,
  rewardID,
})
