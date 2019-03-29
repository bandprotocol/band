import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  holderSelector,
  addressSelector,
  pageSelector,
  pageSizeSelector,
} from 'selectors/basic'

export const holdersSelector = createSelector(
  [holderSelector, addressSelector, pageSelector, pageSizeSelector],
  (holders, address, page, pageSize) => {
    if (!holders.get(address)) return List()
    return holders
      .get(address)
      .sort((a, b) => b.balance - a.balance)
      .map((holder, i) => ({
        rank: i + 1,
        ...holder,
      }))
      .slice((page - 1) * pageSize, page * pageSize)
  },
)

export const numHolders = createSelector(
  [holderSelector, addressSelector],
  (holders, address) => {
    if (!holders.get(address)) return 0
    return holders.get(address).length
  },
)
