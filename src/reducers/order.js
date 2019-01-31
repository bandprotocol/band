import createReducer from 'reducers/creator'

import moment from 'utils/moment'
import { ADD_ORDERS } from 'actions'
import { Map } from 'immutable'

import BN from 'utils/bignumber'

const handleAddOrders = (state, { name, orders }) => {
  const newOrders = orders.reduce(
    (acc, order) =>
      acc.set(
        order.tx_hash,
        Map({
          time: moment(order.block_time),
          price: BN(order.price),
          amount: BN(order.value),
          type: order.order_type,
          user: order.user.toLowerCase(),
        }),
      ),
    Map(),
  )
  return state.set(name, state.get(name, Map()).merge(newOrders))
}

export default createReducer({
  [ADD_ORDERS]: handleAddOrders,
})
