export const LOAD_PRICE_HISTORY = 'LOAD_PRICE_HISTORY'
export const ADD_PRICES = 'ADD_PRICES'

export const loadPriceHistory = name => ({
  type: LOAD_PRICE_HISTORY,
  name,
})

export const addPrices = (name, prices) => ({
  type: ADD_PRICES,
  name,
  prices,
})
