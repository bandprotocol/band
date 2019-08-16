import { createSelector } from 'reselect'

import {
  bandSelector,
  currentSelector,
  addressSelector,
  tcdAddressSelector,
} from 'selectors/basic'
import BN from 'utils/bignumber'

export const balancesSelector = createSelector(
  currentSelector,
  current => current.get('balances'),
)

export const bandBalanceSelector = createSelector(
  [bandSelector, balancesSelector],
  (band, balances) => balances.getIn([band.get('address'), 'value'], new BN(0)),
)

export const bandUnlockBalanceSelector = createSelector(
  [bandSelector, balancesSelector],
  (band, balances) =>
    balances
      .getIn([band.get('address'), 'value'], new BN(0))
      .sub(balances.getIn([band.get('address'), 'lockedValue'], new BN(0))),
)

export const communityBalanceSelector = createSelector(
  [balancesSelector, addressSelector],
  (balances, address) => balances.getIn([address, 'value'], new BN(0)),
)

export const communityUnlockBalanceSelector = createSelector(
  [balancesSelector, addressSelector],
  (balances, address) =>
    balances
      .getIn([address, 'value'], new BN(0))
      .sub(balances.getIn([address, 'lockedValue'], new BN(0))),
)

export const communityLockBalanceSelector = createSelector(
  [balancesSelector, addressSelector],
  (balances, address) => balances.getIn([address, 'lockedValue'], new BN(0)),
)

export const tokenLockByTCDSelector = createSelector(
  [balancesSelector, addressSelector, tcdAddressSelector],
  (balances, address, tcdAddress) =>
    balances.getIn([address, 'lockers', tcdAddress], new BN(0)),
)

export const remainingTokenByTCDSelector = createSelector(
  [balancesSelector, addressSelector, tcdAddressSelector],
  (balances, address, tcdAddress) =>
    balances
      .getIn([address, 'value'], new BN(0))
      .sub(balances.getIn([address, 'lockers', tcdAddress], new BN(0))),
)
