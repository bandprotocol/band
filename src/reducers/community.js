import createReducer from 'reducers/creator'

import { SAVE_COMMUNITY_INFO, SAVE_CT_BALANCE, REMOVE_BALANCE } from 'actions'
import { Map } from 'immutable'

const handleSaveCommunityInfo = (
  state,
  { name, address, logo, description, website, marketCap, price, last24Hrs },
) =>
  state.set(
    name,
    Map({ address, logo, description, website, marketCap, price, last24Hrs }),
  )

const handleSaveCTBalance = (state, { communityName, balance }) =>
  state.setIn([communityName, 'balance'], balance)

const handleRemoveBalance = state =>
  state.map(community => community.delete('balance'))

export default createReducer({
  [REMOVE_BALANCE]: handleRemoveBalance,
  [SAVE_COMMUNITY_INFO]: handleSaveCommunityInfo,
  [SAVE_CT_BALANCE]: handleSaveCTBalance,
})
