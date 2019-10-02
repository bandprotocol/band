import { takeEvery, put, select } from 'redux-saga/effects'
import { RELOAD_BALANCE, saveBalance, dumpCurrent } from 'actions'
import { Utils } from 'band.js'
import { currentUserSelector } from 'selectors/current'

function* handleReloadBalance() {
  const userAddress = yield select(currentUserSelector)
  const query = yield Utils.graphqlRequest(`{
    balances (where: {user:"${userAddress}"}) {
      value
      token {
        id
      }
      lockedValue
    }
    tokenLockeds (where: {user:"${userAddress}"}) {
      token {
        id
      }
      locker
      value
    }
  }`)

  const balances = {}
  for (const { value, token, lockedValue } of query.balances) {
    balances[token.id] = {
      value,
      lockedValue,
      lockers: {},
    }
  }

  for (const { token, locker, value } of query.tokenLockeds) {
    balances[token.id]['lockers'][locker] = value
  }
  yield put(saveBalance(balances))
  yield put(dumpCurrent())
}

export default function*() {
  yield takeEvery(RELOAD_BALANCE, handleReloadBalance)
}
