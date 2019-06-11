import { put } from 'redux-saga/effects'
import { LOAD_HOLDERS, addHolders } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'
import { takeEveryAsync } from 'utils/reduxSaga'

function* handleLoadHolders({ address }) {
  const {
    tokenByAddress: {
      address: tokenAddress,
      balancesByTokenAddress: { nodes: holders },
    },
  } = yield Utils.graphqlRequest(
    `
    {
      tokenByAddress(address: "${address}") {
      address
      balancesByTokenAddress {
        totalCount
        nodes {
          user
          value
          }
        }
      }
    }`,
  )

  yield put(
    addHolders(
      address,
      holders
        .map(holder => ({
          tokenAddress,
          address: holder.user,
          balance: new BN(holder.value),
        }))
        .filter(holder => holder.balance.gt(new BN(0))),
    ),
  )
}

export default function*() {
  yield takeEveryAsync(LOAD_HOLDERS, handleLoadHolders)
}
