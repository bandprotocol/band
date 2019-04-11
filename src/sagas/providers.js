import { BandProtocolClient } from 'band.js'

import { takeEvery, put, select, all } from 'redux-saga/effects'
import {
  UPDATE_PROVIDER,
  setUserAddress,
  saveBandClient,
  saveCommunityClient,
  removeBalance,
  reloadBandBalance,
  reloadCTBalance,
} from 'actions'

import { nameAndAddressCommunitySelector } from 'selectors/communities'
import { currentBandClientSelector } from 'selectors/current'

function* handleUpdateProvider({ address, provider }) {
  yield put(removeBalance())
  if (address) {
    yield put(setUserAddress(address))
    yield put(
      saveBandClient(
        yield BandProtocolClient.make({
          provider,
        }),
      ),
    )
    yield put(reloadBandBalance())
  } else {
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
    yield put(
      saveCommunityClient(
        dapp.get('address'),
        yield bandClient.at(dapp.get('address')),
      ),
    )
  }

  if (address) {
    yield all(
      dapps
        .map(dapp => put(reloadCTBalance(dapp.get('address'))))
        .valueSeq()
        .toJS(),
    )
  }
}

export default function*() {
  yield takeEvery(UPDATE_PROVIDER, handleUpdateProvider)
}
