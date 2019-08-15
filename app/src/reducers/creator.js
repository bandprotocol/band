import { Map } from 'immutable'

export default function createReducer(processors) {
  return (state = Map(), action) => {
    if (processors.hasOwnProperty(action.type)) {
      return processors[action.type](state, action)
    } else {
      return state
    }
  }
}
