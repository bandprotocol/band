import createReducer from 'reducers/creator'
import { fromJS } from 'immutable'

import { SAVE_PROPOSALS } from 'actions'

const handleSaveProposals = (state, { address, proposals }) => {
  return state.set(address, fromJS(proposals))
}

export default createReducer({
  [SAVE_PROPOSALS]: handleSaveProposals,
})
