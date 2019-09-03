export const SET_USER_ADDRESS = 'SET_USER_ADDRESS'
export const SET_NETWORK = 'SET_NETWORK'
export const SAVE_WALLET_TYPE = 'SAVE_WALLET_TYPE'

export const RELOAD_BALANCE = 'RELOAD_BALANCE'
export const SAVE_BALANCE = 'SAVE_BALANCE'

export const DUMP_CURRENT = 'DUMP_CURRENT'
export const LOAD_CURRENT = 'LOAD_CURRENT'

// set user address
export const setUserAddress = address => {
  return { type: SET_USER_ADDRESS, address }
}

// set network
export const setNetwork = network => ({
  type: SET_NETWORK,
  network,
})

// save wallet type
export const saveWalletType = walletType => ({
  type: SAVE_WALLET_TYPE,
  walletType,
})

// reload, save balances
export const reloadBalance = () => ({ type: RELOAD_BALANCE })
export const saveBalance = balances => ({
  type: SAVE_BALANCE,
  balances,
})

// dump, load current(user, balances, network)
export const dumpCurrent = () => ({ type: DUMP_CURRENT })
export const loadCurrent = () => ({ type: LOAD_CURRENT })
