import createReducer from 'reducers/creator'
import { ADD_TCDS } from 'actions'

const handleAddTcds = (state, { commAddress, tcds }) => {
  return state.set(commAddress, tcds)
}

export default createReducer({
  [ADD_TCDS]: handleAddTcds,
})
