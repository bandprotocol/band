import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_ORDER_HISTORY, addOrders } from 'actions'

import {
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'

function* handleLoadHistory({ address, isAll }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }
  const client = yield select(currentCommunityClientSelector, { address })

  // TODO: Limit 10 hardcode
  const orders = yield client.getOrderHistory({
    limit: 100,
    user: isAll ? undefined : yield select(currentUserSelector),
  })
  yield put(addOrders(address, orders))
}

export default function*() {
  yield takeEvery(LOAD_ORDER_HISTORY, handleLoadHistory)
}
