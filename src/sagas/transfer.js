import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_TRANSFER_HISTORY, addTransfers } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'

function* handleLoadTransferHistory({ address }) {
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

  console.warn(transfers)

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
