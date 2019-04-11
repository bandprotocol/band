import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_HOLDERS, addHolders } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'

function* handleLoadHolders({ address }) {
  const {
    communityByAddress: {
      tokenByCommunityAddress: {
        address: tokenAddress,
        balancesByTokenAddress: { nodes: holders },
      },
    },
  } = yield Utils.graphqlRequest(
    `
    {
      communityByAddress(address: "${address}") {
        tokenByCommunityAddress {
          address
          balancesByTokenAddress{
            totalCount
            nodes{
              user
              value
            }
          }
        }
      }
    }
      `,
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
  yield takeEvery(LOAD_HOLDERS, handleLoadHolders)
}
