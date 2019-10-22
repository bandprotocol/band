import { put } from 'redux-saga/effects'
import { LOAD_ORDER_HISTORY, addOrders, addNumOrders } from 'actions'
import { takeEveryAsync } from 'utils/reduxSaga'
import { Utils } from 'band.js'

function* handleLoadHistory({ address, currentPage, pageSize }) {
  const {
    token: {
      curve: { orders, totalCount = 100 },
    },
  } = yield Utils.graphqlRequest(`{
    token(id: "${address}") {
      curve {
        orders (orderBy: timestamp, orderDirection: desc, first: 10, skip: ${(currentPage -
          1) *
          pageSize}) {
          amount
          price
          timestamp
          txHash
          user
          orderType
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
