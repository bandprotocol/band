import createReducer from 'reducers/creator'
import { fromJS } from 'immutable'

import { ADD_REWARDS } from 'actions'

const handleAddReward = (state, { name, rewards }) => {
  return state.set(name, fromJS(rewards))
}

export default createReducer({
  [ADD_REWARDS]: handleAddReward,
})
