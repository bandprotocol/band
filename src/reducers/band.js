import createReducer from 'reducers/creator'

import {
  SAVE_BAND_INFO,
  SAVE_BAND_BALANCE,
  REMOVE_BALANCE,
  SET_WALLET,
  SET_WEB3,
} from 'actions'

const handleSaveBandInfo = (
  state,
  { address, totalSupply, latestPrice, last24Hrs },
) =>
  state
    .set('address', address)
    .set('totalSupply', totalSupply)
    .set('latestPrice', latestPrice)
    .set('last24Hrs', last24Hrs)

const handleSaveBandBalance = (state, { balance }) =>
  state.set('balance', balance)

const handleRemoveBalance = (state, _) => state.delete('balance')

const handleSetWallet = (state, { wallet }) => {
  return state.set('wallet', wallet)
}

const handleSetWeb3 = (state, { web3 }) => {
  return state.set('web3', web3)
}

export default createReducer({
  [SAVE_BAND_INFO]: handleSaveBandInfo,
  [SAVE_BAND_BALANCE]: handleSaveBandBalance,
  [REMOVE_BALANCE]: handleRemoveBalance,
  [SET_WALLET]: handleSetWallet,
  [SET_WEB3]: handleSetWeb3,
})
