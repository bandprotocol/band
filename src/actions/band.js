export const UPDATE_PROVIDER = 'UPDATE_PROVIDER'
export const SAVE_BAND_CLIENT = 'SAVE_BAND_CLIENT'
export const SAVE_BAND_INFO = 'SAVE_BAND_INFO'

export const updateProvider = (address, provider) => ({
  type: UPDATE_PROVIDER,
  address,
  provider,
})

export const saveBandClient = client => ({
  type: SAVE_BAND_CLIENT,
  client,
})

export const saveBandInfo = (address, totalSupply, latestPrice, last24hr) => ({
  type: SAVE_BAND_INFO,
  address,
  totalSupply,
  latestPrice,
  last24hr,
})
