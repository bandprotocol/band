import createReducer from 'reducers/creator'
import { fromJS, Map } from 'immutable'

import {
  SET_USER_ADDRESS,
  SET_NETWORK,
  SAVE_BAND_CLIENT,
  SAVE_COMMUNITY_CLIENT,
  SAVE_BALANCE,
  SAVE_TCD_CLIENT,
  SHOW_MODAL,
  HIDE_MODAL,
} from 'actions'
import BN from 'utils/bignumber'

const handleSetUserAddress = (state, { address }) =>
  state.set('user', address.toLowerCase())

const handleSetNetwork = (state, { network }) => state.set('network', network)

const handleSaveBalance = (state, { balances }) =>
  state.set(
    'balances',
    Object.entries(balances).reduce(
      (agg, [address, m]) =>
        agg.set(
          address,
          Map({
            value: new BN(m.value),
            lockedValue: new BN(m.lockedValue),
            lockers: fromJS(m.lockers).map(v => new BN(v)),
          }),
        ),
      Map(),
    ),
  )

window.lastOpenModal = Date.now()

const handleSaveBandClient = (state, { client }) =>
  state.setIn(['client', 'band'], client)

const handleSaveCommunityClient = (state, { address, client }) =>
  state.setIn(['client', 'communities', address], client)

const handleSaveTCDClient = (state, { address, client }) =>
  state.setIn(['client', 'tcds', address], client)

const handleShowModal = (state, { modalName, data }) => {
  if (Date.now() - window.lastOpenModal < 500) return state
  window.lastOpenModal = Date.now()
  return state.set(
    'modal',
    fromJS({
      name: modalName,
      data,
    }),
  )
}

const handleHideModal = (state, _) => {
  if (Date.now() - window.lastOpenModal < 500) return state
  window.lastOpenModal = Date.now()
  return state.delete('modal')
}

export default createReducer({
  [SET_USER_ADDRESS]: handleSetUserAddress,
  [SET_NETWORK]: handleSetNetwork,
  [SAVE_BALANCE]: handleSaveBalance,
  [SAVE_BAND_CLIENT]: handleSaveBandClient,
  [SAVE_COMMUNITY_CLIENT]: handleSaveCommunityClient,
  [SAVE_TCD_CLIENT]: handleSaveTCDClient,
  [SHOW_MODAL]: handleShowModal,
  [HIDE_MODAL]: handleHideModal,
})
