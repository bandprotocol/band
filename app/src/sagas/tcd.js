import { put, all, select } from 'redux-saga/effects'
import { LOAD_TCDS, addTcds } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'
import { takeEveryAsync } from 'utils/reduxSaga'

import { currentTCDClientSelector } from 'selectors/current'

function* handleLoadTcds({ user, tokenAddress }) {
  const {
    token: {
      tcd: { id, providers },
    },
  } = yield Utils.graphqlRequest(
    `
    {
      token(id:"${tokenAddress}"){
        tcd{
          id
          providers{
            providerAddress
            detail
            stake
            status
            owner
            totalOwnership
            dataProviderOwnerships{
              ownership
              tokenLock
              voter
            }
          }
        }
      }
    }
      `,
  )

  const tcdClient = yield select(currentTCDClientSelector, { address: id })

  const tcds = [
    {
      address: id,
      dataProviders: (yield all(
        providers.map(function*({
          providerAddress: dataSourceAddress,
          detail,
          stake,
          owner,
          totalOwnership,
          dataProviderOwnerships: voters,
        }) {
          let userStake = new BN(0)
          let ownerStake = new BN(0)
          let revenue = new BN(0)
          let userOwnership = new BN(0)
          let ownerOwnership = new BN(0)
          for (const { voter, ownership, tokenLock } of voters) {
            if (voter === user) {
              userStake = new BN(ownership)
                .mul(new BN(stake))
                .div(new BN(totalOwnership))
              revenue = userStake.sub(new BN(tokenLock))
              userOwnership = new BN(ownership)
              //  < -0.01 = BN(0)
              if (revenue.lt(new BN(-0.01))) {
                revenue = new BN(0)
              } else if (revenue.lt(new BN(0)) && revenue.gte(-0.01)) {
                throw new Error('Revenue greater than -0.01')
              }
            }
            if (voter === owner) {
              ownerStake = new BN(ownership)
                .mul(new BN(stake))
                .div(new BN(totalOwnership))
              ownerOwnership = new BN(ownership)
            }
          }
          return {
            dataSourceAddress,
            detail,
            stake: new BN(stake),
            status: tcdClient
              ? yield tcdClient.getStatus(dataSourceAddress)
              : 'NOT_LISTED',
            owner,
            userStake,
            ownerStake,
            userOwnership,
            ownerOwnership,
            totalOwnership: new BN(totalOwnership),
            userRevenue: revenue,
          }
        }),
      ))
        .sort((a, b) => {
          if (a.stake.lt(b.stake)) {
            return 1
          }
          if (a.stake.gt(b.stake)) {
            return -1
          }
          return 0
        })
        .sort((a, b) => {
          return a.status === b.status ? 0 : a.status === 'ACTIVE' ? -1 : 1
        })
        .map((dataProviders, i) => ({ ...dataProviders, rank: i + 1 })),
    },
  ]
  yield put(addTcds(tokenAddress, tcds))
}

export default function*() {
  yield takeEveryAsync(LOAD_TCDS, handleLoadTcds)
}
