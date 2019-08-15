import { createSelector } from 'reselect'
import { List } from 'immutable'
import { orderSelector, addressSelector, pageSelector } from 'selectors/basic'

export const orderHistorySelector = createSelector(
  [orderSelector, addressSelector, pageSelector],
  (orders, address, page) => {
    if (!orders.get(address)) return List()
    return orders.getIn([address, page])
  },
)

export const numOrderSelector = createSelector(
  [orderSelector, addressSelector],
  (orders, address) => {
    if (!orders.get(address)) return 0
    return orders.getIn([address, 'count'])
  },
)
