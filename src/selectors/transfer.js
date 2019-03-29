import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  transferSelector,
  typeSelector,
  addressSelector,
  pageSelector,
  pageSizeSelector,
} from 'selectors/basic'
import { currentUserSelector } from 'selectors/current'

export const transferHistorySelector = createSelector(
  [transferSelector, addressSelector, pageSelector, pageSizeSelector],
  (transfers, address, page, pageSize) => {
    if (!transfers.get(address)) return List()
    return transfers.get(address).slice((page - 1) * pageSize, page * pageSize)
  },
)
