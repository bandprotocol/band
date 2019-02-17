import { createSelector } from 'reselect'

import { rewardSelector, addressSelector } from 'selectors/basic'

export const rewardCommunitySelector = createSelector(
  [rewardSelector, addressSelector],
  (rewards, address) => {
    if (!rewards.get(address)) return null
    return rewards.get(address).toJS()
  },
)
