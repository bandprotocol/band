import createReducer from 'reducers/creator'

import moment from 'utils/moment'
import { ADD_ORDERS, ADD_NUM_ORDERS } from 'actions'
import { Map, List } from 'immutable'

import BN from 'utils/bignumber'

const handleAddOrders = (state, { address, page, orders }) => {
  const newOrders = orders.reduce(
    (acc, order) =>
      acc.push(
        Map({
          time: moment.unix(order.timestamp),
          price: new BN(order.price).divideToFixed(order.amount, 6),
          amount: new BN(order.amount),
          type: order.orderType,
          user: order.user,
          txHash: order.txHash,
        }),
      ),
    List(),
  )
  return state.setIn([address, page], newOrders)
}

const handleAddNumOrders = (state, { address, totalCount }) => {
  return state.setIn([address, 'count'], totalCount)
}

export default createReducer({
  [ADD_ORDERS]: handleAddOrders,
  [ADD_NUM_ORDERS]: handleAddNumOrders,
})
