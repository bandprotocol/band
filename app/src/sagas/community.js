import { put, takeEvery } from 'redux-saga/effects'
import { Utils } from 'band.js'
import { saveCommunityPrice, FETCH_COMMUNITY_PRICE } from 'actions'

function* handleFetchCommunity() {
  const communityDetails = yield Utils.graphqlRequest(
    `
    {
      tokens {
        id
        symbol
        curve {
          price
        }
      }
    }
  `,
  )

  for (const token of communityDetails.tokens) {
    if (token.symbol !== 'BAND') {
      yield put(
        saveCommunityPrice(token.id, parseFloat(token.curve.price) / 1e18),
      )
    }
  }
}

export default function*() {
  yield takeEvery(FETCH_COMMUNITY_PRICE, handleFetchCommunity)
}
