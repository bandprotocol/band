import { put } from 'redux-saga/effects'
import { LOAD_ORDER_HISTORY, addOrders } from 'actions'
import { takeEveryAsync } from 'utils/reduxSaga'
import { Utils } from 'band.js'

function* handleLoadHistory({ address }) {
  // TODO: Find a better way.
  const orders = (yield Utils.graphqlRequest(`{
    tokenByAddress(address: "${address}") {
      curveByTokenAddress{
      ordersByCurveAddress{
        nodes{
          amount
          price
          timestamp
          txHash
          user
          orderType
        }
      }
    }
  }}`)).tokenByAddress.curveByTokenAddress.ordersByCurveAddress.nodes
  yield put(addOrders(address, orders))
}

export default function*() {
  yield takeEveryAsync(LOAD_ORDER_HISTORY, handleLoadHistory)
}
