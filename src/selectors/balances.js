import { createSelector } from 'reselect'

import { bandSelector, currentSelector, addressSelector } from 'selectors/basic'
import BN from 'utils/bignumber'

export const bandBalanceSelector = createSelector(
  [bandSelector, currentSelector],
  (band, current) =>
    current.getIn(['balances', band.get('address')], new BN(0)),
)

export const communityBalanceSelector = createSelector(
  [currentSelector, addressSelector],
  (current, address) => current.getIn(['balances', address], new BN(0)),
)
