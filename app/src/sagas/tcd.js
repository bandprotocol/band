import { put, all, select } from 'redux-saga/effects'
import { LOAD_TCDS, addTcds } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'
import { takeEveryAsync } from 'utils/reduxSaga'

import { currentTCDClientSelector } from 'selectors/current'

function* handleLoadTcds({ user: userRaw, tokenAddress }) {
  const user = userRaw.toLowerCase()
  const {
    token: {
      tcd: { id, minStake, maxProviderCount, providers },
    },
  } = yield Utils.graphqlRequest(
    `
    {
      token(id:"${tokenAddress}"){
        tcd{
          id
          maxProviderCount
          minStake
          providers{
            providerAddress
            detail
            stake
            status
            owner
            totalOwnership
            dataProviderOwnerships{
              ownership
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
      minStake: new BN(minStake),
      maxProviderCount,
      dataProviders: (yield all(
        providers.map(function*({
          providerAddress: dataSourceAddress,
          detail,
          stake,
          status,
          owner,
          totalOwnership,
          dataProviderOwnerships: voters,
        }) {
          const voterToOwnership = {}
          let userStake = new BN(0)
          let ownerStake = new BN(0)
          let revenue = new BN(0)
          for (const { voter, ownership } of voters) {
            voterToOwnership[voter] = ownership
          }

          if (voterToOwnership[user]) {
            userStake = new BN(voterToOwnership[user])
              .mul(new BN(stake))
              .div(new BN(totalOwnership))
            revenue = userStake.sub(
              tcdClient
                ? yield tcdClient.getTokenLock({
                    account: user,
                    dataSource: dataSourceAddress,
                  })
                : new BN('0'),
            )
            //  < -0.01 = BN(0)
            if (revenue.lt(new BN(-0.01))) {
              revenue = new BN(0)
            } else if (revenue.lt(new BN(0)) && revenue.gte(-0.01)) {
              throw new Error('Revenue greater than -0.01')
            }
          }
          if (voterToOwnership[owner]) {
            ownerStake = new BN(voterToOwnership[owner])
              .mul(new BN(stake))
              .div(new BN(totalOwnership))
          }
          return {
            dataSourceAddress,
            detail,
            stake: new BN(stake),
            status,
            owner,
            userStake,
            ownerStake,
            userOwnership: new BN(voterToOwnership[user] || '0'),
            ownerOwnership: new BN(voterToOwnership[owner] || '0'),
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
