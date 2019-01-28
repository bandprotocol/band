import { takeEvery, put } from 'redux-saga/effects'
import { UPDATE_PROVIDER, setUserAddress, saveClient } from 'actions'

import BandProtocolClient from 'band.js'

function* handleUpdateProvider({ web3 }) {
  if (web3) {
    yield put(setUserAddress(web3.eth.accounts[0]))
    yield put(
      saveClient(
        yield BandProtocolClient.make({
          provider: window.web3.currentProvider,
        }),
      ),
    )
  } else {
    yield put(setUserAddress(null))
    yield put(saveClient(yield BandProtocolClient.make({})))
  }
}

export default function*() {
  yield takeEvery(UPDATE_PROVIDER, handleUpdateProvider)
}
