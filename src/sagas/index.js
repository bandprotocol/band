import { all, fork, put, delay, select } from 'redux-saga/effects'
import { currentUserSelector } from 'selectors/current'
import { updateProvider, saveBandInfo, saveCommunityInfo } from 'actions'

import balancesSaga from 'sagas/balances'
import ordersSaga from 'sagas/orders'
import providersSaga from 'sagas/providers'
import transactionsSaga from 'sagas/transaction'

import BandProtocolClient from 'band.js'

function* baseInitialize() {
  const tempBandClient = yield BandProtocolClient.make({})
  const { address, price, last24Hrs } = yield tempBandClient.getBand()

  yield put(
    // TODO: Mock on price and last24hr
    saveBandInfo(address, '1000000000000000000000000', price, last24Hrs),
  )

  const dapps = yield tempBandClient.getDApps()
  for (const dapp of dapps) {
    yield put(
      saveCommunityInfo(
        dapp.name,
        dapp.symbol,
        dapp.address,
        dapp.author,
        dapp.logo,
        dapp.description,
        dapp.website,
        dapp.marketCap,
        dapp.price,
        dapp.last24Hrs,
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
  yield all([
    fork(providersSaga),
    fork(balancesSaga),
    fork(transactionsSaga),
    fork(ordersSaga),
  ])
  yield* baseInitialize()
}
