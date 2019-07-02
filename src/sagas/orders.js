import { put } from 'redux-saga/effects'
import { LOAD_ORDER_HISTORY, addOrders, addNumOrders } from 'actions'
import { takeEveryAsync } from 'utils/reduxSaga'
import { Utils } from 'band.js'

function* handleLoadHistory({ address, currentPage, pageSize }) {
  const {
    tokenByAddress: {
      curveByTokenAddress: {
        ordersByCurveAddress: { nodes: orders, totalCount },
      },
    },
  } = yield Utils.graphqlRequest(`{
    tokenByAddress(address: "${address}") {
      curveByTokenAddress {
        ordersByCurveAddress(orderBy: TIMESTAMP_DESC, first: 10, offset: ${(currentPage -
          1) *
          pageSize}) {
          nodes {
            amount
            price
            timestamp
            txHash
            user
            orderType
          }
          totalCount
        }
      }
    }
  }
  `)
  yield put(addOrders(address, currentPage, orders))
  yield put(addNumOrders(address, totalCount))
}

export default function*() {
  yield takeEveryAsync(LOAD_ORDER_HISTORY, handleLoadHistory)
}
