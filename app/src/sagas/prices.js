import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PRICE_HISTORY, addPrices } from 'actions'
import { Utils } from 'band.js'

function* handleLoadPriceHistory(props) {
  if (!props) return
  const { address } = props
  if (!address) return
  const query = yield Utils.graphqlRequest(`{
    tokenByAddress(address: "${address}") {
      curveByTokenAddress {
        pricesByCurveAddress(orderBy: TIMESTAMP_DESC)  {
          nodes {
            price
            timestamp
          }
        }
      }
    }
  }`)

  yield put(
    addPrices(
      address,
      query.tokenByAddress.curveByTokenAddress.pricesByCurveAddress.nodes,
    ),
  )
}

export default function*() {
  yield takeEvery(LOAD_PRICE_HISTORY, handleLoadPriceHistory)
}
