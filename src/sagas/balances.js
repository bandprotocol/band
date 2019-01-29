import { takeEvery, put, select } from 'redux-saga/effects'
import {
  RELOAD_BAND_BALANCE,
  saveBandBalance,
  RELOAD_CT_BALANCE,
  saveCTBalance,
} from 'actions'
import {
  currentBandClientSelector,
  currentCommunityClientSelector,
} from 'selectors/current'

function* handleReloadBandBalance() {
  const bandBalance = yield (yield select(
    currentBandClientSelector,
  )).getBalance()
  yield put(saveBandBalance(bandBalance))
}

function* handleReloadCTBalance({ communityName }) {
  const communityClient = yield select(currentCommunityClientSelector, {
    name: communityName,
  })
  yield put(saveCTBalance(communityName, yield communityClient.getBalance()))
}

export default function*() {
  yield takeEvery(RELOAD_BAND_BALANCE, handleReloadBandBalance)
  yield takeEvery(RELOAD_CT_BALANCE, handleReloadCTBalance)
}
