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

  const transfers = (yield Utils.graphqlRequest(
    `
      {
        communityByAddress(address: "${address}") {
          tokenByCommunityAddress{
            transfersByTokenAddress{
              nodes{
                sender
                receiver
                value
                txHash
                timestamp
              }
            }
          }
        }
      }
      `,
  )).communityByAddress.tokenByCommunityAddress.transfersByTokenAddress.nodes

  yield put(
    addTransfers(
      address,
      transfers.map(tx => ({
        txHash: tx.txHash,
        timeStamp: tx.timestamp,
        from: tx.sender,
        to: tx.receiver,
        quantity: new BN(tx.value),
      })),
    ),
  )
}

export default function*() {
  yield takeEvery(LOAD_TRANSFER_HISTORY, handleLoadTransferHistory)
}
