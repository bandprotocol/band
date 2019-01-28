import { all, fork, put, delay, select } from 'redux-saga/effects'
import BandProtocolClient from 'band.js'
import BigNumber from 'utils/bignumber'
import { currentUserSelector } from 'selectors/user'
import { updateProvider } from 'actions'

import providersSaga from './providers'

function* baseInitialize() {
  console.log(window.web3.currentProvider.connected)
  const checkProviderTask = yield fork(checkProvider)

  // TODO: Save community info to state
}

function* checkProvider() {
  while (true) {
    const userState = yield select(currentUserSelector)
    const userAddress = window.web3 ? window.web3.eth.accounts[0] : null
    if (userAddress !== userState) {
      yield put(updateProvider(window.web3))
    }
    yield delay(100)
  }
}

export default function*() {
  yield all([fork(providersSaga)])
  yield* baseInitialize()
}
