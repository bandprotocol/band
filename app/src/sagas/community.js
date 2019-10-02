import { put, takeEvery } from 'redux-saga/effects'
import { Utils } from 'band.js'
import { saveCommunityPrice, FETCH_COMMUNITY_PRICE } from 'actions'

function* handleFetchCommunity() {
  const communityDetails = yield Utils.graphqlRequest(
    `
    {
      tokens {
        id
        curve {
          price
        }
      }
    }
  `,
  )

  for (const community of communityDetails.tokens) {
    const token = community.id
    yield put(
      saveCommunityPrice(token, community.curve ? community.curve.price : 0),
    )
  }
}

export default function*() {
  yield takeEvery(FETCH_COMMUNITY_PRICE, handleFetchCommunity)
}
