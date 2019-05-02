import { takeEvery, put, select } from 'redux-saga/effects'
import { LOAD_TCDS, addTcds } from 'actions'
import { Utils } from 'band.js'
import BN from 'bn.js'

function* handleLoadTcds({ user, commAddress }) {
  const {
    communityByAddress: {
      tcdsByCommunityAddress: { nodes: rawTcds },
    },
  } = yield Utils.graphqlRequest(
    `
    {
        communityByAddress(address: "${commAddress}") {
          tcdsByCommunityAddress {
            nodes {
                address
                activeDataSourceCount
                minStake
                dataProvidersByAggregateContract(
                  filter: { status: { notEqualTo: "REMOVED" } }
                ) {
                  nodes {
                    dataSourceAddress
                    detail
                    stake
                    status
                    owner
                    totalOwnership
                    dataProviderOwnershipsByDataSourceAddressAndAggregateContract {
                      nodes {
                        ownership
                        voter
                      }
                    }
                  }
                }
              }
            }
          }
      }

      `,
  )

  window.tcds = [rawTcds, user]

  const tcds = rawTcds.map(
    ({
      address,
      minStake,
      activeDataSourceCount,
      dataProvidersByAggregateContract: { nodes: dataProviders },
    }) => {
      return {
        address,
        minStake: new BN(minStake),
        activeDataSourceCount,
        dataProviders: dataProviders.map(
          ({
            dataSourceAddress,
            detail,
            stake,
            status,
            owner,
            totalOwnership,
            dataProviderOwnershipsByDataSourceAddressAndAggregateContract: {
              nodes: voters,
            },
          }) => {
            const voterToOwnership = {}
            let userStake = new BN(0)
            let ownerStake = new BN(0)
            for (const { voter, ownership } of voters) {
              voterToOwnership[voter] = ownership
            }
            if (voterToOwnership[user]) {
              userStake = new BN(voterToOwnership[user])
                .mul(new BN(stake))
                .div(new BN(totalOwnership))
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
              totalOwnership: new BN(totalOwnership),
            }
          },
        ),
      }
    },
  )

  yield put(addTcds(commAddress, tcds))
}

export default function*() {
  yield takeEvery(LOAD_TCDS, handleLoadTcds)
}
