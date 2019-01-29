import createReducer from 'reducers/creator'

import {
  SET_USER_ADDRESS,
  SAVE_BAND_CLIENT,
  SAVE_COMMUNITY_CLIENT,
} from 'actions'

const handleSetUserAddress = (state, { address }) => state.set('user', address)

const handleSaveBandClient = (state, { client }) =>
  state.setIn(['client', 'band'], client)

const handleSaveCommunityClient = (state, { name, client }) =>
  state.setIn(['client', 'communities', name], client)

export default createReducer({
  [SET_USER_ADDRESS]: handleSetUserAddress,
  [SAVE_BAND_CLIENT]: handleSaveBandClient,
  [SAVE_COMMUNITY_CLIENT]: handleSaveCommunityClient,
})
