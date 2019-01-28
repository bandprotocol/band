import BigNumber from 'utils/bignumber'

export const SET_USER_ADDRESS = 'SET_USER_ADDRESS'

export const RELOAD_MY_BAND_BALANCE = 'RELOAD_MY_BAND_BALANCE'
export const RELOAD_MY_CT_BALANCE = 'RELOAD_MY_CT_BALANCE'

export const SAVE_MY_BAND_BALANCE = 'SAVE_MY_BAND_BALANCE'
export const SAVE_MY_CT_BALANCE = 'SAVE_MY_CT_BALANCE'

export const setUserAddress = address => ({
  type: SET_USER_ADDRESS,
  address,
})

export const reloadMyBandBalance = () => ({ type: RELOAD_MY_BAND_BALANCE })

export const reloadMyCTBalance = address => ({
  type: RELOAD_MY_CT_BALANCE,
  address,
})

export const saveMyBandBalance = balance => ({
  type: SAVE_MY_BAND_BALANCE,
  balance: BigNumber(balance),
})

export const saveMyCTBalance = (address, balance) => ({
  type: SAVE_MY_CT_BALANCE,
  address,
  balance: BigNumber(balance),
})
