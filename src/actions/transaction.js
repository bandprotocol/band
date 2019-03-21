export const ADD_TX = 'ADD_TX'
export const SAVE_TXS = 'SAVE_TXS'
export const BUY_TOKEN = 'BUY_TOKEN'
export const SELL_TOKEN = 'SELL_TOKEN'

export const addTx = (txHash, title, txType) => ({
  type: ADD_TX,
  txHash,
  title,
  txType,
})

export const saveTxs = (currentBlock, txs, force) => ({
  type: SAVE_TXS,
  currentBlock,
  txs,
  force,
})

export const buyToken = (address, amount, priceLimit) => ({
  type: BUY_TOKEN,
  address,
  amount,
  priceLimit,
})

export const sellToken = (address, amount, priceLimit) => ({
  type: SELL_TOKEN,
  address,
  amount,
  priceLimit,
})
