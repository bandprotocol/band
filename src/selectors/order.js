import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  orderSelector,
  addressSelector,
  pageSelector,
  pageSizeSelector,
} from 'selectors/basic'

export const orderHistorySelector = createSelector(
  [orderSelector, addressSelector, pageSelector, pageSizeSelector],
  (orders, address, page, pageSize) => {
    if (!orders.get(address)) return List()
    return orders.get(address).slice((page - 1) * pageSize, page * pageSize)
  },
)

export const noOrderSelector = createSelector(
  [orderSelector, addressSelector],
  (orders, address) => {
    if (!orders.get(address)) return 0
    return orders.get(address).size
  },
)
