import { put, takeEvery } from 'redux-saga/effects'
import { Utils } from 'band.js'
import { saveCommunityPrice, FETCH_COMMUNITY_PRICE } from 'actions'

function* handleFetchCommunity() {
  const communityDetails = yield Utils.graphqlRequest(
    `
    {
      allBandCommunities {
        nodes {
          tokenAddress
  
          tokenByTokenAddress {
            address
            curveByTokenAddress {
              price
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
      saveCommunityPrice(
        token.address,
        parseFloat(token.curveByTokenAddress.price),
      ),
    )
  }
}

export default function*() {
  yield takeEvery(FETCH_COMMUNITY_PRICE, handleFetchCommunity)
}
