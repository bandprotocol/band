import { put } from 'redux-saga/effects'
import { LOAD_TRANSFER_HISTORY, addTransfers, addNumTransfers } from 'actions'
import { Utils } from 'band.js'
import { takeEveryAsync } from 'utils/reduxSaga'
import BN from 'utils/bignumber'
import moment from 'utils/moment'

function* handleLoadTransferHistory({ address, currentPage, pageSize }) {
  const { transfers, totalCount = 100 } = (yield Utils.graphqlRequest(
    `
    {
      token(id: "${address}") {
        transfers(
          orderBy: timestamp,
          first: 10,
          skip: 1,
          where: {
            sender_not:"0x0000000000000000000000000000000000000000",
            receiver_not:"0x0000000000000000000000000000000000000000",
          }
        ) {
            sender
            receiver
            value
            txHash
            timestamp
          }

        }
      }
    }
      `,
  )).token

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
