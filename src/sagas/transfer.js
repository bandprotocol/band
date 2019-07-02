import { put } from 'redux-saga/effects'
import { LOAD_TRANSFER_HISTORY, addTransfers, addNumTransfers } from 'actions'
import { Utils } from 'band.js'
import { takeEveryAsync } from 'utils/reduxSaga'
import BN from 'utils/bignumber'
import moment from 'utils/moment'

function* handleLoadTransferHistory({ address, currentPage }) {
  const { nodes: transfers, totalCount } = (yield Utils.graphqlRequest(
    `
    {
      tokenByAddress(address: "${address}") {
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
          totalCount
        }
      }
    }
    
      `,
  )).tokenByAddress.transfersByTokenAddress

  yield put(
    addTransfers(
      address,
      currentPage,
      transfers.map(tx => ({
        txHash: tx.txHash,
        timeStamp: moment.unix(tx.timestamp),
        from: tx.sender,
        to: tx.receiver,
        quantity: new BN(tx.value),
      })),
    ),
  )
  yield put(addNumTransfers(address, totalCount))
}

export default function*() {
  yield takeEveryAsync(LOAD_TRANSFER_HISTORY, handleLoadTransferHistory)
}
