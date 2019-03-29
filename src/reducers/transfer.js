import createReducer from 'reducers/creator'
import { ADD_TRANSFERS } from 'actions'

const handleAddTransfers = (state, { address, transfers }) => {
  return state.set(address, transfers)
}

export default createReducer({
  [ADD_TRANSFERS]: handleAddTransfers,
})
