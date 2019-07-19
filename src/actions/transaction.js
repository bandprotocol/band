export const ADD_TX = 'ADD_TX'
export const SAVE_TXS = 'SAVE_TXS'
export const SAVE_HIDDEN_TXS = 'SAVE_HIDDEN_TXS'
export const DUMP_TXS = 'DUMP_TXS'
export const HIDE_TXS = 'HIDE_TXS'
export const BUY_TOKEN = 'BUY_TOKEN'
export const SELL_TOKEN = 'SELL_TOKEN'
export const TCD_DEPOSIT = 'TCD_DEPOSIT'
export const TCD_WITHDRAW = 'TCD_WITHDRAW'
export const ADD_PENDING_TX = 'ADD_PENDING_TX'
export const REMOVE_PENDING_TX = 'REMOVE_PENDING_TX'

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

export const saveHiddenTxs = txs => ({
  type: SAVE_HIDDEN_TXS,
  txs,
})

export const dumpTxs = () => ({
  type: DUMP_TXS,
})

export const hideTxs = () => ({
  type: HIDE_TXS,
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

export const tcdDeposit = (tcdAddress, sourceAddress, stake) => ({
  type: TCD_DEPOSIT,
  tcdAddress,
  sourceAddress,
  stake,
})

export const tcdWithdraw = (tcdAddress, sourceAddress, ownership) => ({
  type: TCD_WITHDRAW,
  tcdAddress,
  sourceAddress,
  ownership,
})

export const addPendingTx = (id, title, txType) => ({
  type: ADD_PENDING_TX,
  id,
  title,
  txType,
})

export const removePendingTx = id => ({
  type: REMOVE_PENDING_TX,
  id,
})
