export const LOAD_TRANSFER_HISTORY = 'LOAD_ORDER_HISTORY'
export const ADD_TRANSFERS = 'ADD_TRANSFERS'

export const loadTransferHistory = (address, isAll) => {
  return {
    type: LOAD_TRANSFER_HISTORY,
    address,
    isAll,
  }
}

export const addTransfers = (address, transfers) => ({
  type: ADD_TRANSFERS,
  address,
  transfers,
})
