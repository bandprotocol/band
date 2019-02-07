import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  orderSelector,
  typeSelector,
  nameSelector,
  pageSelector,
  pageSizeSelector,
} from 'selectors/basic'
import { currentUserSelector } from 'selectors/current'

export const orderHistorySelector = createSelector(
  [
    orderSelector,
    nameSelector,
    typeSelector,
    currentUserSelector,
    pageSelector,
    pageSizeSelector,
  ],
  (orders, name, isAll, user, page, pageSize) => {
    if (!orders.get(name)) return List()
    return orders
      .get(name)
      .filter(order => isAll || order.get('user') === user)
      .slice((page - 1) * pageSize, page * pageSize)
  },
)

export const noOrderSelector = createSelector(
  [orderSelector, nameSelector, typeSelector, currentUserSelector],
  (orders, name, isAll, user) => {
    if (!orders.get(name)) return 0
    return orders.get(name).filter(order => isAll || order.get('user') === user)
      .size
  },
)
