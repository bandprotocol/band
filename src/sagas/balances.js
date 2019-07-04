import { takeEvery, put, select } from 'redux-saga/effects'
import { RELOAD_BALANCE, saveBandBalance, saveCTBalance } from 'actions'
import { Utils } from 'band.js'
import { currentUserSelector } from 'selectors/current'
import { bandSelector } from 'selectors/basic'

import BN from 'utils/bignumber'

function* handleReloadBalance() {
  // console.log('Reload price', new Date().getTime())
  const userAddress = yield select(currentUserSelector)
  const bandAddress = (yield select(bandSelector)).get('address')
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
    balances[tokenAddress] = new BN(value)
  }

  for (const { address } of query.allTokens.nodes) {
    if (address === bandAddress) {
      yield put(saveBandBalance(balances[address] || new BN(0)))
    } else {
      yield put(saveCTBalance(address, balances[address] || new BN(0)))
    }
  }
}

export default function*() {
  yield takeEvery(RELOAD_BALANCE, handleReloadBalance)
}
