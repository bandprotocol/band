export const LOAD_TCDS = 'LOAD_TCDS'
export const ADD_TCDS = 'ADD_TCDS'
export const SAVE_TCD_CLIENT = 'SAVE_TCD_CLIENT'

export const loadTcds = (user, tokenAddress) => {
  return {
    type: LOAD_TCDS,
    user,
    tokenAddress,
  }
}

export const addTcds = (tokenAddress, tcds) => ({
  type: ADD_TCDS,
  tokenAddress,
  tcds,
})

export const saveTCDClient = (address, client) => ({
  type: SAVE_TCD_CLIENT,
  address,
  client,
})
