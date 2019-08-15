import createReducer from 'reducers/creator'

import { fromJS } from 'immutable'

import { SAVE_PARAMETERS } from 'actions'
const handleSaveParameters = (state, { address, parameters }) => {
  return state.set(address, fromJS(parameters))
}

export default createReducer({
  [SAVE_PARAMETERS]: handleSaveParameters,
})
