import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PARAMETERS, saveParameters } from 'actions'

import { Utils } from 'band.js'

import BN from 'utils/bignumber'

// HARDCODE
const WEB_REQ_NAME = 'Web Request Oracle'

function* handleLoadParameters({ address }) {
  const { parameter, name } = (yield Utils.graphqlRequest(`{
    token(id: "${address}") {
      name
      parameter{
        params{
          key
          value
        }
      }
    }
  }`)).token
  const currentParameters = parameter.params
  let listInParams = ['bonding', 'params', 'tcd']
  if (name === WEB_REQ_NAME) {
    listInParams = ['bonding', 'params', 'web']
  }
  const params = {}
  for (const parameter of currentParameters) {
    const [prefix, name] = parameter.key.split(':')
    if (listInParams.includes(prefix)) {
      if (!(prefix in params)) {
        params[prefix] = []
      }
      params[prefix].push({ name, value: new BN(parameter.value) })
    }
  }
  yield put(saveParameters(address, params))
}

export default function*() {
  yield takeEvery(LOAD_PARAMETERS, handleLoadParameters)
}
