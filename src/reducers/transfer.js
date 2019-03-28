import createReducer from 'reducers/creator'

import moment from 'utils/moment'
import { ADD_TRANSFERS } from 'actions'
import { Map, List } from 'immutable'

const handleAddTransfers = (state, { address, transfers }) => {
  const newTransfers = transfers
    .reduce(
      (acc, order) =>
        acc.push(
          Map({
            time: moment(order.blockTime),
            price: order.price,
            amount: order.value,
            type: order.orderType,
            user: order.user.toLowerCase(),
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
  return state.set(address, newTransfers)
}

export default createReducer({
  [ADD_TRANSFERS]: handleAddTransfers,
})
