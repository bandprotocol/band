import createReducer from 'reducers/creator'
import { fromJS } from 'immutable'

import { ADD_REWARDS } from 'actions'

const handleAddReward = (state, { address, rewards }) => {
  return state.set(address, fromJS(rewards))
}

export default createReducer({
  [ADD_REWARDS]: handleAddReward,
})
