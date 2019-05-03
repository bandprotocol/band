export const LOAD_TCDS = 'LOAD_TCDS'
export const ADD_TCDS = 'ADD_TCDS'
export const SAVE_TCD_CLIENT = 'SAVE_TCD_CLIENT'

export const loadTcds = (user, commAddress) => {
  return {
    type: LOAD_TCDS,
    user,
    commAddress,
  }
}

export const addTcds = (commAddress, tcds) => ({
  type: ADD_TCDS,
  commAddress,
  tcds,
})

export const saveTCDClient = (address, client) => ({
  type: SAVE_TCD_CLIENT,
  address,
  client,
})
