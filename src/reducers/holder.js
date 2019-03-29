import createReducer from 'reducers/creator'
import { ADD_HOLDERS } from 'actions'

const handleAddHolders = (state, { address, holders }) => {
  return state.set(address, holders)
}

export default createReducer({
  [ADD_HOLDERS]: handleAddHolders,
})
