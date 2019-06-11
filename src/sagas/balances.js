import { takeEvery, put, select } from 'redux-saga/effects'
import { RELOAD_BALANCE, saveBandBalance, saveCTBalance } from 'actions'
import { Utils } from 'band.js'
import { currentUserSelector } from 'selectors/current'
import { bandSelector } from 'selectors/basic'

import BN from 'utils/bignumber'

function* handleReloadBalance() {
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
  for (const { address } of query.allTokens.nodes) {
    if (address === bandAddress) {
      yield put(saveBandBalance(new BN(0)))
    } else {
      yield put(saveCTBalance(address, new BN(0)))
    }
  }

  for (const { value, tokenAddress } of query.allBalances.nodes) {
    if (tokenAddress === bandAddress) {
      yield put(saveBandBalance(new BN(value)))
    } else {
      yield put(saveCTBalance(tokenAddress, new BN(value)))
    }
  }
}

export default function*() {
  yield takeEvery(RELOAD_BALANCE, handleReloadBalance)
}
