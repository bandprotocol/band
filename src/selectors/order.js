import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  orderSelector,
  typeSelector,
  addressSelector,
  pageSelector,
  pageSizeSelector,
} from 'selectors/basic'
import { currentUserSelector } from 'selectors/current'

export const orderHistorySelector = createSelector(
  [
    orderSelector,
    addressSelector,
    typeSelector,
    currentUserSelector,
    pageSelector,
    pageSizeSelector,
  ],
  (orders, address, isAll, user, page, pageSize) => {
    if (!orders.get(address)) return List()
    return orders
      .get(address)
      .filter(order => isAll || order.get('user') === user)
      .slice((page - 1) * pageSize, page * pageSize)
  },
)

export const noOrderSelector = createSelector(
  [orderSelector, addressSelector, typeSelector, currentUserSelector],
  (orders, address, isAll, user) => {
    if (!orders.get(address)) return 0
    return orders
      .get(address)
      .filter(order => isAll || order.get('user') === user).size
  },
)
