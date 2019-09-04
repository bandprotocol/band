import { BandProtocolClient } from 'band.js'
import { takeEvery, put, select } from 'redux-saga/effects'
import {
  UPDATE_CLIENT,
  LOAD_CURRENT,
  setUserAddress,
  setNetwork,
  saveBalance,
  saveWalletType,
  saveBandClient,
  saveCommunityClient,
  saveTCDClient,
  reloadBalance,
  saveTxs,
  saveHiddenTxs,
  DUMP_CURRENT,
} from 'actions'

import { nameAndAddressCommunitySelector } from 'selectors/communities'
import {
  currentBandClientSelector,
  currentUserSelector,
} from 'selectors/current'

import { currentSelector } from 'selectors/basic'

import transit from 'transit-immutable-js'
import { List, Set, Map } from 'immutable'

function* handleUpdateClient({ provider }) {
  const address = yield select(currentUserSelector)
  console.log('current user address:', address)

  if (address) {
    // if user is exist then reload for polling user balance.
    yield put(setUserAddress(address))
    yield put(reloadBalance())
    yield put(
      saveBandClient(
        yield BandProtocolClient.make({
          provider,
        }),
      ),
    )
  } else {
    yield put(setUserAddress('NOT_SIGNIN'))
    yield put(saveBalance({}))
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

/* load user, network, balances and txs from LocalStroage */
function* handleLoadCurrent() {
  // Load user
  const user = localStorage.getItem('user')
  if (user) yield put(setUserAddress(user))

  // Load network
  const network = localStorage.getItem('network')
  yield put(setNetwork(network || 'kovan'))

  // Load balance
  const balances = localStorage.getItem('balances')
  if (balances) yield put(saveBalance(JSON.parse(balances)))
  else yield put(saveBalance({}))

  const walletType = localStorage.getItem('walletType')
  if (walletType) yield put(saveWalletType(walletType))

  // load txs and hidden txs
  if (user) {
    const rawTxState = localStorage.getItem(`txs-${user}`)
    const rawHiddenTxState = localStorage.getItem(`hiddenTxs-${user}`)
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
    yield put(saveTxs(0, List(), true))
    yield put(saveHiddenTxs(Set()))
  }
}

/* save user, network and balances to LocalStroage */
function* handleDumpCurrent() {
  const current = yield select(currentSelector)
  // Dump user
  const user = current.get('user')
  if (user) localStorage.setItem('user', user)
  else localStorage.removeItem('user')
  // Dump network
  const network = current.get('network')
  if (network) localStorage.setItem('network', network)
  else localStorage.removeItem('network')
  // Dump balance
  const balances = current.get('balances')
  // Dump wallet type
  const walletType = current.get('walletType')
  if (walletType) localStorage.setItem('walletType', walletType)

  if (balances) {
    const bj = balances.map(v =>
      Map({
        value: v.get('value').toString(),
        lockedValue: v.get('lockedValue').toString(),
        lockers: v.get('lockers').map(l => l.toString()),
      }),
    )
    localStorage.setItem('balances', JSON.stringify(bj.toJS()))
  } else localStorage.removeItem('balances')
}

export default function*() {
  yield takeEvery(UPDATE_CLIENT, handleUpdateClient)
  yield takeEvery(LOAD_CURRENT, handleLoadCurrent)
  yield takeEvery(DUMP_CURRENT, handleDumpCurrent)
}
