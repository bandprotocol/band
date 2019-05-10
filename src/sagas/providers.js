import { BandProtocolClient } from 'band.js'

import { takeEvery, put, select, all } from 'redux-saga/effects'
import {
  UPDATE_PROVIDER,
  setUserAddress,
  saveBandClient,
  saveCommunityClient,
  saveTCDClient,
  removeBalance,
  reloadBalance,
} from 'actions'

import { nameAndAddressCommunitySelector } from 'selectors/communities'
import { currentBandClientSelector } from 'selectors/current'

function* handleUpdateProvider({ address, provider }) {
  if (address) {
    yield put(setUserAddress(address))
    yield put(
      saveBandClient(
        yield BandProtocolClient.make({
          provider,
        }),
      ),
    )
    yield put(reloadBalance())
  } else {
    yield put(removeBalance())
    yield put(setUserAddress(null))
    yield put(
      saveBandClient(
        yield BandProtocolClient.make({
          provider: window.BandWallet.ref.current.state.provider,
        }),
      ),
    )
  }

  const bandClient = yield select(currentBandClientSelector)
  const dapps = yield select(nameAndAddressCommunitySelector)

  for (const dapp of dapps.valueSeq()) {
    const commClient = yield bandClient.at(dapp.get('address'))
    const commAddress = dapp.get('address')
    yield put(saveCommunityClient(commAddress, commClient))
    for (const address of dapp.get('tcds').valueSeq()) {
      yield put(saveTCDClient(address, yield commClient.tcd(address)))
    }
  }
}

export default function*() {
  yield takeEvery(UPDATE_PROVIDER, handleUpdateProvider)
}
