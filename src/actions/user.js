export const SET_USER_ADDRESS = 'SET_USER_ADDRESS'

export const RELOAD_BALANCE = 'RELOAD_BALANCE'

export const SAVE_BAND_BALANCE = 'SAVE_BAND_BALANCE'
export const SAVE_CT_BALANCE = 'SAVE_CT_BALANCE'

export const REMOVE_BALANCE = 'REMOVE_BALANCE'

export const setUserAddress = address => ({
  type: SET_USER_ADDRESS,
  address,
})

export const reloadBalance = () => ({ type: RELOAD_BALANCE })

export const saveBandBalance = balance => ({
  type: SAVE_BAND_BALANCE,
  balance: balance,
})

export const saveCTBalance = (communityAddress, balance) => ({
  type: SAVE_CT_BALANCE,
  communityAddress,
  balance: balance,
})

export const removeBalance = () => ({ type: REMOVE_BALANCE })
