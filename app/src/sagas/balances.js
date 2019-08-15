import { takeEvery, put, select } from 'redux-saga/effects'
import { RELOAD_BALANCE, saveBalance, dumpCurrent } from 'actions'
import { Utils } from 'band.js'
import { currentUserSelector } from 'selectors/current'

function* handleReloadBalance() {
  const userAddress = yield select(currentUserSelector)
  const query = yield Utils.graphqlRequest(`{
    allBalances(condition: {user: "${userAddress}"}) {
      nodes {
        value
        tokenAddress
        lockedValue
      }
    }
    allTokenLockeds(condition: {user: "${userAddress}"}){
      nodes{
        tokenAddress
        locker
        value
      }
    }
  }`)

  const balances = {}
  for (const { value, tokenAddress, lockedValue } of query.allBalances.nodes) {
    balances[tokenAddress] = {
      value,
      lockedValue,
      lockers: {},
    }
  }

  for (const { tokenAddress, locker, value } of query.allTokenLockeds.nodes) {
    balances[tokenAddress]['lockers'][locker] = value
  }
  yield put(saveBalance(balances))
  yield put(dumpCurrent())
}

export default function*() {
  yield takeEvery(RELOAD_BALANCE, handleReloadBalance)
}
