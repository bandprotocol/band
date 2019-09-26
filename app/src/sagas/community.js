import { put, takeEvery } from 'redux-saga/effects'
import BN from 'utils/bignumber'
import { Utils } from 'band.js'
import { Map } from 'immutable'
import { saveCommunityInfo, FETCH_COMMUNITY } from 'actions'

import {
  logoCommunityFromSymbol,
  bannerCommunityFromSymbol,
} from 'utils/communityImg'

function* handleFetchCommunity() {
  const communityDetails = yield Utils.graphqlRequest(
    `
    {
      allBandCommunities {
        nodes {
          tokenAddress
          name
          organization
          description
          website
          logo
          banner
          tokenByTokenAddress {
            address
            symbol
            totalSupply
            curveByTokenAddress {
              price
              collateralEquation
              pricesByCurveAddress(first: 1, filter: {timestamp: {lessThan: ${Math.trunc(
                new Date().getTime() / 1000 - 86400,
              )}}}, orderBy: TIMESTAMP_DESC) {
                nodes {
                  price
                  totalSupply
                }
              }
            }
            tcdsByTokenAddress {
              nodes {
                address
                prefix
                maxProviderCount
                minStake
                dataProvidersByTcdAddress(filter: {status: {notEqualTo: "DISABLED"}}) {
                  nodes {
                    stake
                    dataSourceAddress
                  }
                }
              }
            }
            tcrsByTokenAddress {
              nodes {
                listedEntries: entriesByTcrAddress(filter: {status: {equalTo: "LISTED"}}) {
                  totalCount
                }
                appliedEntries: entriesByTcrAddress(filter: {status: {equalTo: "APPLIED"}}) {
                  totalCount
                }
                challengedEntries: entriesByTcrAddress(filter: {status: {equalTo: "CHALLENGED"}}) {
                  totalCount
                }
                rejectedEntries: entriesByTcrAddress(filter: {status: {equalTo: "REJECTED"}}) {
                  totalCount
                }
              }
            }
            parameterByTokenAddress {
              address
            }
          }
        }
      }
    }
  `,
  )

  for (const community of communityDetails.allBandCommunities.nodes) {
    const token = community.tokenByTokenAddress
    yield put(
      saveCommunityInfo(
        community.name,
        token.symbol,
        token.address,
        community.organization,
        logoCommunityFromSymbol(token.symbol),
        bannerCommunityFromSymbol(token.symbol),
        community.description,
        community.website,
        (parseFloat(token.curveByTokenAddress.price) *
          parseFloat(token.totalSupply)) /
          1e18,
        parseFloat(token.curveByTokenAddress.price),
        new BN(token.totalSupply),
        parseFloat(
          token.curveByTokenAddress.pricesByCurveAddress.nodes[0]
            ? token.curveByTokenAddress.pricesByCurveAddress.nodes[0].price
            : 0,
        ),
        new BN(
          token.curveByTokenAddress.pricesByCurveAddress.nodes[0]
            ? token.curveByTokenAddress.pricesByCurveAddress.nodes[0]
                .totalSupply
            : 0,
        ),
        token.curveByTokenAddress.collateralEquation,
        token.tcdsByTokenAddress.nodes[0] &&
          token.tcdsByTokenAddress.nodes.reduce(
            (acc, each) =>
              acc.set(
                each.address,
                Map({
                  prefix: each.prefix,
                  minStake: each.minStake,
                  maxProviderCount: each.maxProviderCount,
                  totalStake: each.dataProvidersByTcdAddress.nodes.reduce(
                    (c, { stake }) => c.add(new BN(stake)),
                    new BN(0),
                  ),
                  dataProviderCount:
                    each.dataProvidersByTcdAddress.nodes.length,
                  providers: each.dataProvidersByTcdAddress.nodes.map(
                    x => x.dataSourceAddress,
                  ),
                }),
              ),
            Map(),
          ),
        token.tcrsByTokenAddress.nodes[0] && {
          listed: token.tcrsByTokenAddress.nodes[0].listedEntries.totalCount,
          applied: token.tcrsByTokenAddress.nodes[0].appliedEntries.totalCount,
          challenged:
            token.tcrsByTokenAddress.nodes[0].challengedEntries.totalCount,
          rejected:
            token.tcrsByTokenAddress.nodes[0].rejectedEntries.totalCount,
        },
        token.parameterByTokenAddress.address,
      ),
    )
  }
}

export default function*() {
  yield takeEvery(FETCH_COMMUNITY, handleFetchCommunity)
}
