import createReducer from 'reducers/creator'
import { ADD_TOKEN } from 'actions'

const handleAddToken = (state, { address, token }) => {
  return state.set(address, token)
}

export default createReducer({
  [ADD_TOKEN]: handleAddToken,
})
