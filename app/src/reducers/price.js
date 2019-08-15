import createReducer from 'reducers/creator'

import moment from 'utils/moment'
import { ADD_PRICES } from 'actions'
import { List } from 'immutable'

const handleAddPrices = (state, { address, prices }) => {
  const newPrices = prices.reduce(
    (acc, price) =>
      acc.push(List([moment.unix(price.timestamp), parseFloat(price.price)])),
    List(),
  )
  return state.set(address, newPrices)
}

export default createReducer({
  [ADD_PRICES]: handleAddPrices,
})
