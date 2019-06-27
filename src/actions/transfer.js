export const LOAD_TRANSFER_HISTORY = 'LOAD_TRANSFER_HISTORY'
export const ADD_TRANSFERS = 'ADD_TRANSFERS'

export const loadTransferHistory = address => {
  return {
    type: LOAD_TRANSFER_HISTORY,
    address,
  }
}

export const addTransfers = (address, transfers) => ({
  type: ADD_TRANSFERS,
  address,
  transfers,
})
