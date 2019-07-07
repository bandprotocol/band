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
      }
    }
    allTokens {
      nodes {
        address
      }
    }
  }`)

  const balances = {}
  for (const { value, tokenAddress } of query.allBalances.nodes) {
    balances[tokenAddress] = value
  }
  yield put(saveBalance(balances))
  yield put(dumpCurrent())
}

export default function*() {
  yield takeEvery(RELOAD_BALANCE, handleReloadBalance)
}
