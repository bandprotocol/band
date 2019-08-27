import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PARAMETERS, saveParameters } from 'actions'

import { Utils } from 'band.js'

import BN from 'utils/bignumber'

function* handleLoadParameters({ address }) {
  const { currentParameters } = (yield Utils.graphqlRequest(`{
    tokenByAddress(address: "${address}") {
      parameterByTokenAddress{
        currentParameters
      }
    }
  }`)).tokenByAddress.parameterByTokenAddress

  const params = {}
  const listInParams = ['bonding', 'params', 'tcd']
  for (const [key, value] of Object.entries(currentParameters)) {
    const [prefix, name] = key.split(':')
    if (listInParams.includes(prefix)) {
      if (!(prefix in params)) {
        params[prefix] = []
      }
      params[prefix].push({ name, value: new BN(value) })
    }
  }
  yield put(saveParameters(address, params))
}

export default function*() {
  yield takeEvery(LOAD_PARAMETERS, handleLoadParameters)
}
