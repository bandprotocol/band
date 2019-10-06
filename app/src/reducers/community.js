import createReducer from 'reducers/creator'

import { SAVE_COMMUNITY_INFO, SAVE_COMMUNITY_PRICE } from 'actions'
import { Map } from 'immutable'

const handleSaveCommunityPrice = (state, { tokenAddress, price }) =>
  state.setIn([tokenAddress, 'price'], price)

const handleSaveCommunityInfo = (
  state,
  {
    name,
    symbol,
    tokenAddress,
    logo,
    banner,
    description,
    website,
    organization,
    marketCap,
    price,
    totalSupply,
    last24HrsPrice,
    last24HrsTotalSupply,
    collateralEquation,
    tcds,
    tcr,
    parameterAddress,
    curveAddress,
  },
) =>
  state.set(
    tokenAddress,
    Map({
      name,
      tokenAddress,
      symbol,
      logo,
      banner,
      description,
      website,
      organization,
      marketCap,
      price,
      totalSupply,
      last24HrsPrice,
      last24HrsTotalSupply,
      collateralEquation,
      tcds,
      tcr,
      parameterAddress,
      curveAddress,
    }),
  )

export default createReducer({
  [SAVE_COMMUNITY_INFO]: handleSaveCommunityInfo,
  [SAVE_COMMUNITY_PRICE]: handleSaveCommunityPrice,
})
