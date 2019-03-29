import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_TRANSFER_HISTORY, addTransfers } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'
import { currentCommunityClientSelector } from 'selectors/current'

function* handleLoadTransferHistory({ address }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }

  const {
    community: {
      token: { transferHistory: transfers },
    },
  } = yield Utils.graphqlRequest(
    `
      {
        community(address:"${address}") {
          token {
            transferHistory {
              tx {
                txHash
                blockTimestamp
              }
              sender {
                address
              }
              receiver {
                address
              }
              value
            }
          }
        }
      }
      `,
  )

  // TODO ???
  yield put(
    addTransfers(
      address,
      transfers.map(tx => ({
        txHash: tx.tx.txHash,
        timeStamp: tx.tx.blockTimestamp,
        from: tx.sender.address,
        to: tx.receiver.address,
        quantity: new BN(tx.value),
      })),
    ),
  )
}

export default function*() {
  yield takeEvery(LOAD_TRANSFER_HISTORY, handleLoadTransferHistory)
}
