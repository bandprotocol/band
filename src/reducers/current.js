import createReducer from './creator'

import { SET_USER_ADDRESS, SAVE_CLIENT } from 'actions'

const handleSetUserAddress = (state, { address }) => state.set('user', address)

const handleSaveClient = (state, { client }) => state.set('bandClient', client)

export default createReducer({
  [SET_USER_ADDRESS]: handleSetUserAddress,
  [SAVE_CLIENT]: handleSaveClient,
})
