export const UPDATE_CLIENT = 'UPDATE_CLIENT'
export const SAVE_BAND_CLIENT = 'SAVE_BAND_CLIENT'
export const SAVE_BAND_INFO = 'SAVE_BAND_INFO'
export const SET_WALLET = 'SET_WALLET'
export const SET_WEB3 = 'SET_WEB3'
export const SET_XFN_REWARD_INFO = 'SET_XFN_REWARD_INFO'

export const updateClient = provider => ({
  type: UPDATE_CLIENT,
  provider,
})

export const saveBandClient = client => ({
  type: SAVE_BAND_CLIENT,
  client,
})

export const saveBandInfo = (address, totalSupply, latestPrice, last24Hrs) => ({
  type: SAVE_BAND_INFO,
  address,
  totalSupply,
  latestPrice,
  last24Hrs,
})

export const setWallet = wallet => ({
  type: SET_WALLET,
  wallet: wallet,
})

export const setWeb3 = web3 => ({
  type: SET_WEB3,
  web3: web3,
})

export const setXFNRewardInfo = xfnRewardInfo => {
  return {
    type: SET_XFN_REWARD_INFO,
    xfnRewardInfo: xfnRewardInfo,
  }
}
