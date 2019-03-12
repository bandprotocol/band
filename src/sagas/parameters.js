import { takeEvery, put, select, delay } from 'redux-saga/effects'

import { LOAD_PARAMETERS, saveParameters } from 'actions'

import { currentCommunityClientSelector } from 'selectors/current'

function* handleLoadParameters({ address }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }

  const parameterClient = (yield select(currentCommunityClientSelector, {
    address,
  })).parameter()

  const rawParams = yield parameterClient.getParameters()
  const params = {}
  for (const param of rawParams) {
    const [prefix, name] = param.key.split(':')
    if (!(prefix in params)) {
      params[prefix] = []
    }
    params[prefix].push({ name, value: param.value })
  }
  yield put(saveParameters(address, params))
}

export default function*() {
  yield takeEvery(LOAD_PARAMETERS, handleLoadParameters)
}
