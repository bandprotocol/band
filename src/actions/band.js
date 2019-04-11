export const UPDATE_PROVIDER = 'UPDATE_PROVIDER'
export const SAVE_BAND_CLIENT = 'SAVE_BAND_CLIENT'
export const SAVE_BAND_INFO = 'SAVE_BAND_INFO'
export const SET_WALLET = 'SET_WALLET'
export const SET_WEB3 = 'SET_WEB3'

export const updateProvider = (address, provider) => ({
  type: UPDATE_PROVIDER,
  address,
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
