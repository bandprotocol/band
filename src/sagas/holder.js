import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_HOLDERS, addHolders } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'
import { currentCommunityClientSelector } from 'selectors/current'

function* handleLoadHolders({ address }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }

  const {
    community: {
      token: { balances: holders },
    },
  } = yield Utils.graphqlRequest(
    `
    {
        community(address:"${address}") {
          token {
            balances {
              user {
                address
              }
              value
            }
          }
        }
      }
      `,
  )

  // TODO ???
  yield put(
    addHolders(
      address,
      holders
        .map(holder => ({
          address: holder.user.address,
          balance: new BN(holder.value),
        }))
        .filter(holder => !holder.balance.isZero()),
    ),
  )
}

export default function*() {
  yield takeEvery(LOAD_HOLDERS, handleLoadHolders)
}
