export const TRACK_TRANSACTION = 'TRACK_TRANSACTION'
export const UPDATE_CONFIRMATION = 'UPDATE_CONFIRMATION'

export const trackTransaction = emitter => ({
  type: TRACK_TRANSACTION,
  emitter,
})

export const updateConfimation = (txHash, confirmationNumber) => ({
  type: UPDATE_CONFIRMATION,
  txHash,
  confirmationNumber,
})
