import { createSelector } from 'reselect'
import { List } from 'immutable'

import { priceSelector, addressSelector } from 'selectors/basic'

export const priceHistorySelector = createSelector(
  [priceSelector, addressSelector],
  (prices, address) => {
    if (!prices.get(address)) return List()
    return prices.get(address)
  },
)
