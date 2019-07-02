export const LOAD_HOLDERS = 'LOAD_HOLDERS'
export const ADD_HOLDERS = 'ADD_HOLDERS'
export const ADD_NUM_HOLDERS = 'ADD_NUM_HOLDERS'

export const loadHolders = (address, currentPage, pageSize) => {
  return {
    type: LOAD_HOLDERS,
    address,
    currentPage,
    pageSize,
  }
}

export const addHolders = (address, page, holders) => ({
  type: ADD_HOLDERS,
  address,
  page,
  holders,
})

export const addNumHolders = (address, totalCount) => ({
  type: ADD_NUM_HOLDERS,
  address,
  totalCount,
})
