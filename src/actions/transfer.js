export const LOAD_TRANSFER_HISTORY = 'LOAD_TRANSFER_HISTORY'
export const ADD_TRANSFERS = 'ADD_TRANSFERS'
export const ADD_NUM_TRANSFERS = 'ADD_NUM_TRANSFERS'

export const loadTransferHistory = (address, currentPage) => {
  return {
    type: LOAD_TRANSFER_HISTORY,
    address,
    currentPage,
  }
}

export const addTransfers = (address, page, transfers) => ({
  type: ADD_TRANSFERS,
  address,
  page,
  transfers,
})

export const addNumTransfers = (address, totalCount) => ({
  type: ADD_NUM_TRANSFERS,
  address,
  totalCount,
})
