import { takeEvery, put } from 'redux-saga/effects'

import { LOAD_PARAMETERS, saveParameters } from 'actions'

import { Utils } from 'band.js'

import BN from 'utils/bignumber'

// HARDCODE
const WEB_REQ_NAME = 'Web Request Oracle'

function* handleLoadParameters({ address }) {
  // const { parameterByTokenAddress, name } = (yield Utils.graphqlRequest(`{
  //   tokenByAddress(address: "${address}") {
  //     parameterByTokenAddress{
  //       currentParameters
  //     }
  //     name
  //   }
  // }`)).tokenByAddress

  const { parameterByTokenAddress, name } = {
    parameterByTokenAddress: {
      currentParameters: {
        'bonding:liquidity_spread': '0',
        'bonding:revenue_beneficiary':
          '186270247521495727156000628426749590077654649991',
        'bonding:inflation_rate': '1585489599',
        'bonding:curve_expression':
          '626297886519760905581371693378737356669879536629',
        'params:expiration_time': '259200',
        'params:min_participation_pct': '25000000000000000000',
        'params:support_required_pct': '80000000000000000000',
        'tcd:min_provider_stake': '100000000000000000000000',
        'tcd:max_provider_count': '7',
        'tcd:owner_revenue_pct': '300000000000000000',
        'tcd:query_price': '2000000000000000',
        'tcd:withdraw_delay': '0',
      },
    },
    name: 'XFN',
  }

  const currentParameters = parameterByTokenAddress.currentParameters

  let listInParams = ['bonding', 'params', 'tcd']
  if (name === WEB_REQ_NAME) {
    listInParams = ['bonding', 'params', 'web']
  }

  const params = {}

  for (const [key, value] of Object.entries(currentParameters)) {
    const [prefix, name] = key.split(':')
    if (listInParams.includes(prefix)) {
      if (!(prefix in params)) {
        params[prefix] = []
      }
      params[prefix].push({ name, value: new BN(value) })
    }
  }
  yield put(saveParameters(address, params))
}

export default function*() {
  yield takeEvery(LOAD_PARAMETERS, handleLoadParameters)
}
