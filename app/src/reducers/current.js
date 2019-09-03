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
  SAVE_WALLET_TYPE,
} from 'actions'
import BN from 'utils/bignumber'

const handleSetUserAddress = (state, { address }) => state.set('user', address)

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

const handleSaveWalletType = (state, { walletType }) =>
  state.set('walletType', walletType)

const handleSaveBandClient = (state, { client }) =>
  state.setIn(['client', 'band'], client)

const handleSaveCommunityClient = (state, { address, client }) =>
  state.setIn(['client', 'communities', address], client)

const handleSaveTCDClient = (state, { address, client }) =>
  state.setIn(['client', 'tcds', address], client)

const handleShowModal = (state, { modalName, data }) =>
  state.set(
    'modal',
    fromJS({
      name: modalName,
      data,
    }),
  )

const handleHideModal = (state, _) => state.delete('modal')

export default createReducer({
  [SET_USER_ADDRESS]: handleSetUserAddress,
  [SET_NETWORK]: handleSetNetwork,
  [SAVE_BALANCE]: handleSaveBalance,
  [SAVE_WALLET_TYPE]: handleSaveWalletType,
  [SAVE_BAND_CLIENT]: handleSaveBandClient,
  [SAVE_COMMUNITY_CLIENT]: handleSaveCommunityClient,
  [SAVE_TCD_CLIENT]: handleSaveTCDClient,
  [SHOW_MODAL]: handleShowModal,
  [HIDE_MODAL]: handleHideModal,
})
