export const LOAD_PRICE_HISTORY = 'LOAD_PRICE_HISTORY'
export const ADD_PRICES = 'ADD_PRICES'

export const loadPriceHistory = address => ({
  type: LOAD_PRICE_HISTORY,
  address,
})

export const addPrices = (address, prices) => ({
  type: ADD_PRICES,
  address,
  prices,
})
