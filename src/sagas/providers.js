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
  console.log('Update provider', address)
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
    const tokenAddress = dapp.get('address')
    const commClient = yield bandClient.at(tokenAddress)
    yield put(saveCommunityClient(tokenAddress, commClient))
    const tcdList = dapp.get('tcds')
    if (tcdList) {
      for (const address of tcdList.keySeq()) {
        yield put(saveTCDClient(address, commClient.tcd(address)))
      }
    }
  }
}

export default function*() {
  yield takeEvery(UPDATE_PROVIDER, handleUpdateProvider)
}
