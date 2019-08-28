import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PARAMETERS, saveParameters } from 'actions'

import { Utils } from 'band.js'

import BN from 'utils/bignumber'

const WEB_REQ_ADDRESS = '0x3DEb207E098F882C3F351C494b26B26548a33f5B'

function* handleLoadParameters({ address }) {
  const { currentParameters } = (yield Utils.graphqlRequest(`{
    tokenByAddress(address: "${address}") {
      parameterByTokenAddress{
        currentParameters
      }
    }
  }`)).tokenByAddress.parameterByTokenAddress

  let listInParams = ['bonding', 'params', 'tcd']
  if (address === WEB_REQ_ADDRESS) {
    listInParams = ['bonding', 'params', 'web']
  }

  const params = {}

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
