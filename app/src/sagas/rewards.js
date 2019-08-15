import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_REWARDS, addRewards } from 'actions'

import {
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'

function* handleLoadReward({ address }) {
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }
  const client = yield select(currentCommunityClientSelector, { address })
  const rewards = yield client.getRewards({
    user: yield select(currentUserSelector),
  })
  yield put(addRewards(address, rewards))
}

export default function*() {
  yield takeEvery(LOAD_REWARDS, handleLoadReward)
}
