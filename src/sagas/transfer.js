import { takeEvery, put } from 'redux-saga/effects'
import { LOAD_TRANSFER_HISTORY, addTransfers } from 'actions'
import { Utils } from 'band.js'

import BN from 'utils/bignumber'
import moment from 'utils/moment'

function* handleLoadTransferHistory({ address }) {
  const transfers = (yield Utils.graphqlRequest(
    `
      {
        communityByAddress(address: "${address}") {
          tokenByCommunityAddress {
            transfersByTokenAddress(
              orderBy: TIMESTAMP_DESC
              filter: {
                sender: { notEqualTo: "0x0000000000000000000000000000000000000000" }
                receiver: { notEqualTo: "0x0000000000000000000000000000000000000000" }
              }
            ) {
              nodes {
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
        timeStamp: moment.unix(tx.timestamp),
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
