import createReducer from 'reducers/creator'
import { TOGGLE_FETCH } from 'actions'

const handleToggleFetch = (_, { fetch }) => {
  return fetch
}

export default createReducer({
  [TOGGLE_FETCH]: handleToggleFetch,
})
