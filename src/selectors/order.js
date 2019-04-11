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
    currentUserSelector,
    pageSelector,
    pageSizeSelector,
  ],
  (orders, address, user, page, pageSize) => {
    console.log('TT', orders.get(address), page)
    console.log(
      '2',
      orders.get(address).slice((page - 1) * pageSize, page * pageSize),
    )
    if (!orders.get(address)) return List()
    return orders.get(address).slice((page - 1) * pageSize, page * pageSize)
  },
)

export const noOrderSelector = createSelector(
  [orderSelector, addressSelector, currentUserSelector],
  (orders, address, user) => {
    console.log(address, orders.get(address))
    if (!orders.get(address)) return 0
    return orders.get(address).size
  },
)
