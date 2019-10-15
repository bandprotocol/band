import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PRICE_HISTORY, addPrices } from 'actions'
import { Utils } from 'band.js'

function* handleLoadPriceHistory(props) {
  if (!props) return
  const { address } = props
  if (!address) return

  let prices = []
  for (let i = 0; i < 1000; i++) {
    const query = yield Utils.graphqlRequest(`
    {
      token(id:"${address}") {
        curve {
          prices (orderBy: timestamp, orderDirection: desc, first: 1000, skip: ${i *
            1000}) {
            price
            timestamp
          }
        }
      }
    }
    `)
    if (query.token.curve.prices.length === 0) {
      break
    }
    prices = prices.concat(query.token.curve.prices)
  }

  yield put(addPrices(address, prices))
}

export default function*() {
  yield takeEvery(LOAD_PRICE_HISTORY, handleLoadPriceHistory)
}
