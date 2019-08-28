import createReducer from 'reducers/creator'
import { ADD_TCDS } from 'actions'
import { Map } from 'immutable'

const handleAddTcds = (state, { tokenAddress, tcds }) => {
  return state.set(
    tokenAddress,
    tcds.reduce((acc, tcd) => acc.set(tcd.address, Map({ ...tcd })), Map()),
  )
}

export default createReducer({
  [ADD_TCDS]: handleAddTcds,
})
