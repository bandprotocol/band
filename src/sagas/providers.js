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
  saveTxs,
  saveHiddenTxs,
} from 'actions'

import { nameAndAddressCommunitySelector } from 'selectors/communities'
import { currentBandClientSelector } from 'selectors/current'

import transit from 'transit-immutable-js'
import { List, Set } from 'immutable'

function* handleUpdateProvider({ address, provider }) {
  if (address) {
    yield put(setUserAddress(address))
    yield put(reloadBalance())
    yield put(
      saveBandClient(
        yield BandProtocolClient.make({
          provider,
        }),
      ),
    )
    const rawTxState = localStorage.getItem(`txs-${address}`)
    const rawHiddenTxState = localStorage.getItem(`hiddenTxs-${address}`)
    if (rawTxState && rawHiddenTxState) {
      const txState = transit.fromJSON(rawTxState)
      const hiddenTxState = transit.fromJSON(rawHiddenTxState)
      yield put(saveTxs(0, txState, true))
      yield put(saveHiddenTxs(hiddenTxState))
    } else if (rawTxState) {
      const txState = transit.fromJSON(rawTxState)
      yield put(saveTxs(0, txState, true))
      yield put(saveHiddenTxs(Set()))
    } else {
      yield put(saveTxs(0, List(), true))
      yield put(saveHiddenTxs(Set()))
    }
  } else {
    yield put(removeBalance())
    yield put(setUserAddress('NOT_SIGNIN'))
    yield put(
      saveBandClient(
        yield BandProtocolClient.make({
          provider: window.BandWallet.ref.current.state.provider,
        }),
      ),
    )
    yield put(saveTxs(0, List(), true))
    yield put(saveHiddenTxs(Set()))
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
