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
  [
    transferSelector,
    addressSelector,
    typeSelector,
    currentUserSelector,
    pageSelector,
    pageSizeSelector,
  ],
  (transfers, address, isAll, user, page, pageSize) => {
    if (!transfers.get(address)) return List()
    return transfers
      .get(address)
      .filter(order => isAll || order.get('user') === user)
      .slice((page - 1) * pageSize, page * pageSize)
  },
)

export const noOrderSelector = createSelector(
  [transferSelector, addressSelector, typeSelector, currentUserSelector],
  (transfers, address, isAll, user) => {
    if (!transfers.get(address)) return 0
    return transfers
      .get(address)
      .filter(order => isAll || order.get('user') === user).size
  },
)
