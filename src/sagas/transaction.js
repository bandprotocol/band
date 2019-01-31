import { takeEvery, put } from 'redux-saga/effects'
import { channel } from 'redux-saga'
import { TRACK_TRANSACTION, updateConfimation } from 'actions'

const confirmationChannel = channel()

function handleTrackTransaction({ emitter }) {
  emitter.on('confirmation', (confirmationNumber, receipt) => {
    confirmationChannel.put({
      txHash: receipt.transactionHash,
      confirmationNumber,
    })
  })
}

function* handleConfirmChannel({ txHash, confirmationNumber }) {
  yield put(updateConfimation(txHash, confirmationNumber))
}

export default function*() {
  yield takeEvery(confirmationChannel, handleConfirmChannel)
  yield takeEvery(TRACK_TRANSACTION, handleTrackTransaction)
}
