import createReducer from 'reducers/creator'
import { ADD_TRANSFERS, ADD_NUM_TRANSFERS } from 'actions'

const handleAddTransfers = (state, { address, page, transfers }) => {
  return state.setIn([address, page], transfers)
}

const handleAddNumTransfers = (state, { address, totalCount }) => {
  return state.setIn([address, 'count'], totalCount)
}

export default createReducer({
  [ADD_TRANSFERS]: handleAddTransfers,
  [ADD_NUM_TRANSFERS]: handleAddNumTransfers,
})
