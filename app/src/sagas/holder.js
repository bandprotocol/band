import { put } from 'redux-saga/effects'
import { LOAD_HOLDERS, addHolders, addNumHolders } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'
import { takeEveryAsync } from 'utils/reduxSaga'

function* handleLoadHolders({ address, currentPage, pageSize }) {
  if (!address) return

  const result = yield Utils.graphqlRequest(
    `{
      token(id: "${address}") {
        id
        holderCount
        holders (orderBy: value, orderDirection: desc, first: 10, skip: ${(currentPage -
          1) *
          pageSize}) {
          user
          value
        }
      }
    }`,
  )

  const {
    token: { id: tokenAddress, holderCount: totalCount, holders },
  } = result

  yield put(
    addHolders(
      address,
      currentPage,
      holders.map(holder => ({
        tokenAddress,
        address: holder.user,
        balance: new BN(holder.value),
      })),
    ),
  )

  yield put(addNumHolders(address, totalCount))
}

export default function*() {
  yield takeEveryAsync(LOAD_HOLDERS, handleLoadHolders)
}
