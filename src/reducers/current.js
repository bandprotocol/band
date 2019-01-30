import createReducer from 'reducers/creator'

import {
  SET_USER_ADDRESS,
  SAVE_BAND_CLIENT,
  SAVE_COMMUNITY_CLIENT,
  SHOW_MODAL,
  HIDE_MODAL,
} from 'actions'

const handleSetUserAddress = (state, { address }) => state.set('user', address)

const handleSaveBandClient = (state, { client }) =>
  state.setIn(['client', 'band'], client)

const handleSaveCommunityClient = (state, { name, client }) =>
  state.setIn(['client', 'communities', name], client)

const handleShowModal = (state, { modalName }) =>
  state.set('modalName', modalName)

const handleHideModal = (state, _) => state.delete('modalName')

export default createReducer({
  [SET_USER_ADDRESS]: handleSetUserAddress,
  [SAVE_BAND_CLIENT]: handleSaveBandClient,
  [SAVE_COMMUNITY_CLIENT]: handleSaveCommunityClient,
  [SHOW_MODAL]: handleShowModal,
  [HIDE_MODAL]: handleHideModal,
})
