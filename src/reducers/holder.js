import createReducer from 'reducers/creator'
import { ADD_HOLDERS, ADD_NUM_HOLDERS } from 'actions'

const handleAddHolders = (state, { address, page, holders }) => {
  return state.setIn([address, page], holders)
}

const handleAddNumHolders = (state, { address, totalCount }) => {
  return state.setIn([address, 'count'], totalCount)
}

export default createReducer({
  [ADD_HOLDERS]: handleAddHolders,
  [ADD_NUM_HOLDERS]: handleAddNumHolders,
})
