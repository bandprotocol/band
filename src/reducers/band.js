import createReducer from 'reducers/creator'

import { SAVE_BAND_INFO, SAVE_BAND_BALANCE, REMOVE_BALANCE } from 'actions'

const handleSaveBandInfo = (
  state,
  { address, totalSupply, latestPrice, last24hr },
) =>
  state
    .set('address', address)
    .set('totalSupply', totalSupply)
    .set('latestPrice', latestPrice)
    .set('last24hrChange', last24hr)

const handleSaveBandBalance = (state, { balance }) =>
  state.set('balance', balance)

const handleRemoveBalance = (state, _) => state.delete('balance')

export default createReducer({
  [SAVE_BAND_INFO]: handleSaveBandInfo,
  [SAVE_BAND_BALANCE]: handleSaveBandBalance,
  [REMOVE_BALANCE]: handleRemoveBalance,
})
