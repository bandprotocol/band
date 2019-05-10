import { take, fork, put } from 'redux-saga/effects'
import { LOAD_ORDER_HISTORY, addOrders } from 'actions'
import { takeEveryAsync } from 'utils/reduxSaga'
import { Utils } from 'band.js'

function* handleLoadHistory({ address }) {
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
          orderType
        }
      }
    }
  }}`)).communityByAddress.curveByCommunityAddress.ordersByCurveAddress.nodes
  yield put(addOrders(address, orders))
}

export default function*() {
  yield takeEveryAsync(LOAD_ORDER_HISTORY, handleLoadHistory)
}
