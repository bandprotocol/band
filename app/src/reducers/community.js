import createReducer from 'reducers/creator'

import { SAVE_COMMUNITY_INFO } from 'actions'
import { Map } from 'immutable'

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
    }),
  )

export default createReducer({
  [SAVE_COMMUNITY_INFO]: handleSaveCommunityInfo,
})
