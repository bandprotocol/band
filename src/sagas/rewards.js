import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_REWARDS, addRewards } from 'actions'

import {
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'

function* handleLoadReward({ name }) {
  while (true) {
    if (yield select(currentCommunityClientSelector, { name })) break
    yield delay(100)
  }
  const client = yield select(currentCommunityClientSelector, { name })
  const rewards = yield client.getRewards({
    user: yield select(currentUserSelector),
  })
  yield put(addRewards(name, rewards))
}

export default function*() {
  yield takeEvery(LOAD_REWARDS, handleLoadReward)
}
