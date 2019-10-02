import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PARAMETERS, saveParameters } from 'actions'

import { Utils } from 'band.js'

import BN from 'utils/bignumber'

// HARDCODE
const WEB_REQ_NAME = 'Web Request Oracle'

function* handleLoadParameters({ address }) {
  // const { parameterByTokenAddress, name } = (yield Utils.graphqlRequest(`{
  //   tokenByAddress(address: "${address}") {
  //     parameterByTokenAddress{
  //       currentParameters
  //     }
  //     name
  //   }
  // }`)).tokenByAddress
  // const currentParameters = parameterByTokenAddress.currentParameters
  // let listInParams = ['bonding', 'params', 'tcd']
  // if (name === WEB_REQ_NAME) {
  //   listInParams = ['bonding', 'params', 'web']
  // }
  // const params = {}
  // for (const [key, value] of Object.entries(currentParameters)) {
  //   const [prefix, name] = key.split(':')
  //   if (listInParams.includes(prefix)) {
  //     if (!(prefix in params)) {
  //       params[prefix] = []
  //     }
  //     params[prefix].push({ name, value: new BN(value) })
  //   }
  // }
  // yield put(saveParameters(address, params))
}

export default function*() {
  yield takeEvery(LOAD_PARAMETERS, handleLoadParameters)
}
