import { takeEvery, put, select, delay } from 'redux-saga/effects'

import { LOAD_PARAMETERS, saveParameters } from 'actions'

import { Utils } from 'band.js'

import BN from 'utils/bignumber'

function* handleLoadParameters({ address }) {
  const { currentParameters } = (yield Utils.graphqlRequest(`{
    communityByAddress(address: "${address}") {
      parameterByCommunityAddress{
        currentParameters
      }
    }
  }`)).communityByAddress.parameterByCommunityAddress

  const params = {}
  for (const [key, value] of Object.entries(currentParameters)) {
    const [prefix, name] = key.split(':')
    if (!(prefix in params)) {
      params[prefix] = []
    }
    params[prefix].push({ name, value: new BN(value) })
  }
  yield put(saveParameters(address, params))
}

export default function*() {
  yield takeEvery(LOAD_PARAMETERS, handleLoadParameters)
}
