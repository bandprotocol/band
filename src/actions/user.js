import BN from 'utils/bignumber'

export const SET_USER_ADDRESS = 'SET_USER_ADDRESS'

export const RELOAD_BAND_BALANCE = 'RELOAD_BAND_BALANCE'
export const RELOAD_CT_BALANCE = 'RELOAD_CT_BALANCE'

export const SAVE_BAND_BALANCE = 'SAVE_BAND_BALANCE'
export const SAVE_CT_BALANCE = 'SAVE_CT_BALANCE'

export const REMOVE_BALANCE = 'REMOVE_BALANCE'

export const setUserAddress = address => ({
  type: SET_USER_ADDRESS,
  address,
})

export const reloadBandBalance = () => ({ type: RELOAD_BAND_BALANCE })

export const reloadCTBalance = communityName => ({
  type: RELOAD_CT_BALANCE,
  communityName,
})

export const saveBandBalance = balance => ({
  type: SAVE_BAND_BALANCE,
  balance: BN(balance),
})

export const saveCTBalance = (communityName, balance) => ({
  type: SAVE_CT_BALANCE,
  communityName,
  balance: BN(balance),
})

export const removeBalance = () => ({ type: REMOVE_BALANCE })
