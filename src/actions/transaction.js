export const TRACK_TRANSACTION = 'TRACK_TRANSACTION'
export const UPDATE_CONFIRMATION = 'UPDATE_CONFIRMATION'
export const BUY_TOKEN = 'BUY_TOKEN'
export const SELL_TOKEN = 'SELL_TOKEN'

export const trackTransaction = emitter => ({
  type: TRACK_TRANSACTION,
  emitter,
})

export const updateConfimation = (txHash, confirmationNumber) => ({
  type: UPDATE_CONFIRMATION,
  txHash,
  confirmationNumber,
})

export const buyToken = (name, amount, priceLimit) => ({
  type: BUY_TOKEN,
  name,
  amount,
  priceLimit,
})

export const sellToken = (name, amount, priceLimit) => ({
  type: SELL_TOKEN,
  name,
  amount,
  priceLimit,
})
