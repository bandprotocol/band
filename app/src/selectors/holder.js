import { createSelector } from 'reselect'
import { List } from 'immutable'
import { holderSelector, addressSelector, pageSelector } from 'selectors/basic'

export const holdersSelector = createSelector(
  [holderSelector, addressSelector, pageSelector],
  (holders, address, page) => {
    if (!holders.get(address)) return List()
    return holders.getIn([address, page]).map((holder, i) => ({
      rank: i + 1,
      ...holder,
    }))
  },
)

export const numHolders = createSelector(
  [holderSelector, addressSelector],
  (holders, address) => {
    if (!holders.get(address)) return 0
    return holders.getIn([address, 'count'])
  },
)
