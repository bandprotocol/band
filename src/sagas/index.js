import { all, fork, put, delay, select } from 'redux-saga/effects'
import { currentUserSelector } from 'selectors/current'
import { updateProvider, saveBandInfo, saveCommunityInfo } from 'actions'

import balancesSaga from 'sagas/balances'
import providersSaga from 'sagas/providers'

import BandProtocolClient from 'band.js'

function* baseInitialize() {
  const tempBandClient = yield BandProtocolClient.make({})
  const bandAddress = (yield tempBandClient.getBand()).address

  yield put(
    // TODO: Mock on price and last24hr
    saveBandInfo(bandAddress, '1000000000000000000000000', '1.00', '+1.0%'),
  )

  const dapps = yield tempBandClient.getDApps()
  for (const dapp of dapps) {
    yield put(
      saveCommunityInfo(
        dapp.name,
        dapp.address,
        dapp.logo,
        dapp.description,
        dapp.website,
      ),
    )
  }

  // Update user address and balance after fetch all data
  yield fork(checkProvider)
}

function* checkProvider() {
  while (true) {
    const userState = yield select(currentUserSelector)
    const userAddress = window.web3.eth.accounts[0] || null
    if (userAddress !== userState) {
      yield put(updateProvider(userAddress, window.web3.currentProvider))
    }
    yield delay(100)
  }
}

export default function*() {
  yield all([fork(providersSaga), fork(balancesSaga)])
  yield* baseInitialize()
}
