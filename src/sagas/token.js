import { takeEvery, put, select, delay } from 'redux-saga/effects'
import { LOAD_TOKEN, addToken } from 'actions'
import { Utils } from 'band.js'
import { currentCommunityClientSelector } from 'selectors/current'

function* handleLoadToken({ address }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }

  const {
    community: {
      token: { address: tokenAddress },
    },
  } = yield Utils.graphqlRequest(
    `
      {
        community(address:"${address}") {
          token {
            address
          }
        }
      }

      `,
  )

  // TODO ???
  yield put(addToken(address, tokenAddress))
}

export default function*() {
  yield takeEvery(LOAD_TOKEN, handleLoadToken)
}
