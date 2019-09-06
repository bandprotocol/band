import { createSelector } from 'reselect'
import { currentSelector, addressSelector, bandSelector } from 'selectors/basic'

export const currentUserSelector = createSelector(
  currentSelector,
  current => current.get('user'),
)

export const currentNetworkSelector = createSelector(
  currentSelector,
  current => current.get('network'),
)

export const walletTypeSelector = createSelector(
  currentSelector,
  current => current.get('walletType'),
)

export const currentModalSelector = createSelector(
  currentSelector,
  current => current.get('modal'),
)

export const currentBandClientSelector = createSelector(
  currentSelector,
  current => current.getIn(['client', 'band']),
)

export const currentCommunityClientSelector = createSelector(
  [currentSelector, addressSelector],
  (current, address) => current.getIn(['client', 'communities', address]),
)

export const currentTCDClientSelector = createSelector(
  [currentSelector, addressSelector],
  (current, address) => current.getIn(['client', 'tcds', address]),
)

export const web3Selector = createSelector(
  bandSelector,
  band => band.get('web3'),
)
