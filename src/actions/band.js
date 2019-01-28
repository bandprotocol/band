export const UPDATE_PROVIDER = 'UPDATE_PROVIDER'
export const SAVE_CLIENT = 'SAVE_CLIENT'

export const updateProvider = web3 => ({
  type: UPDATE_PROVIDER,
  web3,
})

export const saveClient = client => ({
  type: SAVE_CLIENT,
  client,
})
