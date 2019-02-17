import createReducer from 'reducers/creator'

import { SAVE_COMMUNITY_INFO, SAVE_CT_BALANCE, REMOVE_BALANCE } from 'actions'
import { Map } from 'immutable'

const handleSaveCommunityInfo = (
  state,
  {
    name,
    symbol,
    address,
    logo,
    description,
    website,
    author,
    marketCap,
    price,
    last24Hrs,
  },
) =>
  state.set(
    address,
    Map({
      name,
      address,
      symbol,
      logo,
      description,
      website,
      author,
      marketCap,
      price,
      last24Hrs,
    }),
  )

const handleSaveCTBalance = (state, { communityAddress, balance }) =>
  state.setIn([communityAddress, 'balance'], balance)

const handleRemoveBalance = state =>
  state.map(community => community.delete('balance'))

export default createReducer({
  [REMOVE_BALANCE]: handleRemoveBalance,
  [SAVE_COMMUNITY_INFO]: handleSaveCommunityInfo,
  [SAVE_CT_BALANCE]: handleSaveCTBalance,
})
