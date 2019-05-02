import { createSelector } from 'reselect'
import { List } from 'immutable'
import { tcdSelector, addressSelector } from 'selectors/basic'

export const tcdsSelector = createSelector(
  [tcdSelector, addressSelector],
  (tcds, address) => {
    if (!tcds.get(address)) return List()
    return tcds.get(address)
  },
)

export const numTcds = createSelector(
  [tcdSelector, addressSelector],
  (tcds, address) => {
    if (!tcds.get(address)) return 0
    return tcds.get(address).length
  },
)
