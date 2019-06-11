import createReducer from 'reducers/creator'
import { ADD_TCDS } from 'actions'
import { Map, List } from 'immutable'

window.ImList = List

const handleAddTcds = (state, { tokenAddress, tcds }) => {
  return state.set(
    tokenAddress,
    List(
      tcds.map(tcd =>
        Map({
          ...tcd,
          dataProviders: List(tcd.dataProviders.map(dp => Map({ ...dp }))),
        }),
      ),
    ),
  )
}

export default createReducer({
  [ADD_TCDS]: handleAddTcds,
})
