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
    last24Hrs,
    totalSupply,
    collateralEquation,
    tcds,
    tcr,
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
      last24Hrs,
      totalSupply,
      collateralEquation,
      tcds,
      tcr,
    }),
  )

export default createReducer({
  [SAVE_COMMUNITY_INFO]: handleSaveCommunityInfo,
})
