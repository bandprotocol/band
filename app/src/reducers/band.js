import createReducer from 'reducers/creator'

import { SAVE_BAND_INFO, SET_WALLET, SET_WEB3 } from 'actions'

const handleSaveBandInfo = (
  state,
  { address, totalSupply, latestPrice, last24Hrs },
) =>
  state
    .set('address', address)
    .set('totalSupply', totalSupply)
    .set('latestPrice', latestPrice)
    .set('last24Hrs', last24Hrs)

const handleSetWallet = (state, { wallet }) => {
  return state.set('wallet', wallet)
}

const handleSetWeb3 = (state, { web3 }) => {
  return state.set('web3', web3)
}

export default createReducer({
  [SAVE_BAND_INFO]: handleSaveBandInfo,
  [SET_WALLET]: handleSetWallet,
  [SET_WEB3]: handleSetWeb3,
})
