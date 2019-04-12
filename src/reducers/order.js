import createReducer from 'reducers/creator'

import moment from 'utils/moment'
import { ADD_ORDERS } from 'actions'
import { Map, List } from 'immutable'

import BN from 'utils/bignumber'

const handleAddOrders = (state, { address, orders }) => {
  const newOrders = orders
    .reduce(
      (acc, order) =>
        acc.push(
          Map({
            time: moment.unix(order.timestamp),
            price: new BN(order.price),
            amount: new BN(order.amount),
            type: order.orderType,
            user: order.user,
            txHash: order.txHash,
          }),
        ),
      List(),
    )
    .sort((a, b) => {
      if (a.get('time') > b.get('time')) return -1
      if (a.get('time') < b.get('time')) return 1
      return 0
    })
  return state.set(address, newOrders)
}

export default createReducer({
  [ADD_ORDERS]: handleAddOrders,
})
