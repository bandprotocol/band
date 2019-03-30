import { takeEvery, put, select, delay } from 'redux-saga/effects'

import { LOAD_PRICE_HISTORY, addPrices } from 'actions'

import { currentCommunityClientSelector } from 'selectors/current'

function* handleLoadPriceHistory({ address }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }
  const client = yield select(currentCommunityClientSelector, { address })
  const pricers = yield client.getPriceHistory({})
  console.log('heyhey', pricers)
  yield put(addPrices(address, pricers))
}

export default function*() {
  yield takeEvery(LOAD_PRICE_HISTORY, handleLoadPriceHistory)
}
