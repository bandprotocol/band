export const LOAD_HOLDERS = 'LOAD_HOLDERS'
export const ADD_HOLDERS = 'ADD_HOLDERS'

export const loadHolders = address => {
  return {
    type: LOAD_HOLDERS,
    address,
  }
}

export const addHolders = (address, holders) => ({
  type: ADD_HOLDERS,
  address,
  holders,
})
