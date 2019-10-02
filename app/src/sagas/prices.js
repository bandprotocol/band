import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PRICE_HISTORY, addPrices } from 'actions'
import { Utils } from 'band.js'

function* handleLoadPriceHistory(props) {
  if (!props) return
  const { address } = props
  if (!address) return
  const query = yield Utils.graphqlRequest(`{
      token(id:"${address}") {
        curve {
          prices (orderBy: timestamp, orderDirection: desc) {
            price
            timestamp
          }
        }
      }
    }
  }`)

  yield put(addPrices(address, query.token.curve.prices))
}

export default function*() {
  yield takeEvery(LOAD_PRICE_HISTORY, handleLoadPriceHistory)
}
