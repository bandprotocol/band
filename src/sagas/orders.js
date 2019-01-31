import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_ORDER_HISTORY, addOrders } from 'actions'

import { orderHistorySelector } from 'selectors/order'

import {
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'

function* handleLoadHistory({ name, isAll }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { name })) break
    yield delay(100)
  }
  const client = yield select(currentCommunityClientSelector, { name })

  // TODO: Limit 10 hardcode
  const orders = yield client.getOrderHistory({
    limit: 10,
    user: isAll ? undefined : yield select(currentUserSelector),
  })
  yield put(addOrders(name, orders))
}

export default function*() {
  yield takeEvery(LOAD_ORDER_HISTORY, handleLoadHistory)
}
