import { takeEvery, put, select, delay } from 'redux-saga/effects'

import { LOAD_PRICE_HISTORY, addPrices } from 'actions'

import { currentCommunityClientSelector } from 'selectors/current'

function* handleLoadPriceHistory({ name, isAll }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { name })) break
    yield delay(100)
  }
  const client = yield select(currentCommunityClientSelector, { name })

  const pricers = yield client.getPriceHistory({})
  yield put(addPrices(name, pricers))
}

export default function*() {
  yield takeEvery(LOAD_PRICE_HISTORY, handleLoadPriceHistory)
}
