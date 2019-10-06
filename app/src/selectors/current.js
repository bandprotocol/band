import { createSelector } from 'reselect'
import {
  currentSelector,
  addressSelector,
  bandSelector,
  communitySelector,
} from 'selectors/basic'

export const currentUserSelector = createSelector(
  currentSelector,
  current => current.get('user'),
)

export const currentNetworkSelector = createSelector(
  currentSelector,
  current => current.get('network'),
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

export const currentParameterClientSelector = createSelector(
  [currentBandClientSelector, communitySelector, addressSelector],
  (current, community, address) =>
    current.newParameterClient(community.getIn([address, 'parameterAddress'])),
)

export const currentTCDClientSelector = createSelector(
  [currentSelector, addressSelector],
  (current, address) => current.getIn(['client', 'tcds', address]),
)

export const bandAddressSelector = createSelector(
  bandSelector,
  band => band.get('address'),
)
export const web3Selector = createSelector(
  bandSelector,
  band => band.get('web3'),
)

export const xfnRewardInfoSelector = createSelector(
  bandSelector,
  band => band.get('xfnRewardInfo'),
)
