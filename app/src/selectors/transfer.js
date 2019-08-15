import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  transferSelector,
  addressSelector,
  pageSelector,
} from 'selectors/basic'

export const transferHistorySelector = createSelector(
  [transferSelector, addressSelector, pageSelector],
  (transfers, address, page) => {
    if (!transfers.get(address)) return List()
    return transfers.getIn([address, page])
  },
)

export const numTransferSelector = createSelector(
  [transferSelector, addressSelector],
  (transfers, address) => {
    if (!transfers.get(address)) return 0
    return transfers.getIn([address, 'count'])
  },
)
