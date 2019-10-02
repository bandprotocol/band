import { put } from 'redux-saga/effects'
import { LOAD_TCDS, addTcds } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'
import { takeEveryAsync } from 'utils/reduxSaga'

function* handleLoadTcds({ user, tokenAddress }) {
  // const {
  //   tokenByAddress: {
  //     tcdsByTokenAddress: { nodes: rawTcds },
  //   },
  // } = yield Utils.graphqlRequest(
  //   `
  //   {
  //     tokenByAddress(address: "${tokenAddress}") {
  //       tcdsByTokenAddress {
  //         nodes {
  //             address
  //             maxProviderCount
  //             minStake
  //             dataProvidersByTcdAddress(
  //               filter: { status: { notEqualTo: "DISABLED" } }
  //             ) {
  //               nodes {
  //                 dataSourceAddress
  //                 detail
  //                 stake
  //                 status
  //                 owner
  //                 totalOwnership
  //                 dataProviderOwnershipsByDataSourceAddressAndTcdAddress {
  //                   nodes {
  //                     ownership
  //                     voter
  //                     tokenLock
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //     `,
  // )
  // const tcds = rawTcds.map(
  //   ({
  //     address,
  //     minStake,
  //     maxProviderCount,
  //     dataProvidersByTcdAddress: { nodes: dataProviders },
  //   }) => {
  //     return {
  //       address,
  //       minStake: new BN(minStake),
  //       maxProviderCount,
  //       dataProviders: dataProviders
  //         .map(
  //           ({
  //             dataSourceAddress,
  //             detail,
  //             stake,
  //             status,
  //             owner,
  //             totalOwnership,
  //             dataProviderOwnershipsByDataSourceAddressAndTcdAddress: {
  //               nodes: voters,
  //             },
  //           }) => {
  //             const voterToOwnership = {}
  //             let userStake = new BN(0)
  //             let ownerStake = new BN(0)
  //             let revenue = new BN(0)
  //             const voterToTokenLock = {}
  //             for (const { voter, ownership, tokenLock } of voters) {
  //               voterToOwnership[voter] = ownership
  //               voterToTokenLock[voter] = tokenLock
  //             }
  //             if (voterToOwnership[user]) {
  //               userStake = new BN(voterToOwnership[user])
  //                 .mul(new BN(stake))
  //                 .div(new BN(totalOwnership))
  //             }
  //             if (voterToOwnership[owner]) {
  //               ownerStake = new BN(voterToOwnership[owner])
  //                 .mul(new BN(stake))
  //                 .div(new BN(totalOwnership))
  //             }
  //             if (voterToTokenLock[user]) {
  //               revenue = userStake.sub(new BN(voterToTokenLock[user]))
  //               //  < -0.01 = BN(0)
  //               if (revenue.lt(new BN(-0.01))) {
  //                 revenue = new BN(0)
  //               } else if (revenue.lt(new BN(0)) && revenue.gte(-0.01)) {
  //                 throw new Error('Revenue greater than -0.01')
  //               }
  //             }
  //             return {
  //               dataSourceAddress,
  //               detail,
  //               stake: new BN(stake),
  //               status,
  //               owner,
  //               userStake,
  //               ownerStake,
  //               userOwnership: new BN(voterToOwnership[user] || '0'),
  //               ownerOwnership: new BN(voterToOwnership[owner] || '0'),
  //               totalOwnership: new BN(totalOwnership),
  //               userRevenue: revenue,
  //             }
  //           },
  //         )
  //         .sort((a, b) => {
  //           if (a.stake.lt(b.stake)) {
  //             return 1
  //           }
  //           if (a.stake.gt(b.stake)) {
  //             return -1
  //           }
  //           return 0
  //         })
  //         .sort((a, b) => {
  //           return a.status === b.status ? 0 : a.status === 'ACTIVE' ? -1 : 1
  //         })
  //         .map((dataProviders, i) => ({ ...dataProviders, rank: i + 1 })),
  //     }
  //   },
  // )
  // yield put(addTcds(tokenAddress, tcds))
}

export default function*() {
  yield takeEveryAsync(LOAD_TCDS, handleLoadTcds)
}
