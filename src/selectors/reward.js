import { createSelector } from 'reselect'

import { rewardSelector, nameSelector } from 'selectors/basic'

export const rewardCommunitySelector = createSelector(
  [rewardSelector, nameSelector],
  (rewards, name) => {
    if (!rewards.get(name)) return []
    return rewards.get(name).toJS()
  },
)
