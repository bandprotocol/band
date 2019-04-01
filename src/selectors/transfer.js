import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  transferSelector,
  addressSelector,
  pageSelector,
  pageSizeSelector,
} from 'selectors/basic'

export const transferHistorySelector = createSelector(
  [transferSelector, addressSelector, pageSelector, pageSizeSelector],
  (transfers, address, page, pageSize) => {
    if (!transfers.get(address)) return List()
    return transfers
      .get(address)
      .reverse()
      .slice((page - 1) * pageSize, page * pageSize)
  },
)

export const noTransferSelector = createSelector(
  [transferSelector, addressSelector],
  (transfers, address) => {
    if (!transfers.get(address)) return 0
    return transfers.get(address).length
  },
)
