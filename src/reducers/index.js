import { combineReducers } from 'redux-immutable'

import band from 'reducers/band'
import community from 'reducers/community'
import current from 'reducers/current'
import order from 'reducers/order'
import price from 'reducers/price'
import reward from 'reducers/reward'
import transaction from 'reducers/transaction'
import parameter from 'reducers/parameter'
import proposal from 'reducers/proposal'

export default combineReducers({
  band,
  community,
  current,
  order,
  price,
  reward,
  transaction,
  parameter,
  proposal,
})
