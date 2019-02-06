import { createSelector } from 'reselect'
import { List } from 'immutable'

import { priceSelector, nameSelector } from 'selectors/basic'

export const priceHistorySelector = createSelector(
  [priceSelector, nameSelector],
  (prices, name) => {
    if (!prices.get(name)) return List()
    return prices.get(name)
  },
)
