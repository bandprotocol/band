import { takeEvery, put } from 'redux-saga/effects'
import { LOAD_ORDER_HISTORY, addOrders } from 'actions'

import { Utils } from 'band.js'

function* handleLoadHistory({ address, isAll }) {
  // TODO: Find a better way.
  const orders = (yield Utils.graphqlRequest(`{
    communityByAddress(address: "${address}") {
    curveByCommunityAddress{
      ordersByCurveAddress{
        nodes{
          amount
          price
          timestamp
          txHash
          user
        }
      }
    }
  }}`)).communityByAddress.curveByCommunityAddress.ordersByCurveAddress.nodes
  yield put(addOrders(address, orders))
}

export default function*() {
  yield takeEvery(LOAD_ORDER_HISTORY, handleLoadHistory)
}
