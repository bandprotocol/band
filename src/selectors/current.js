import { createSelector } from 'reselect'
import { currentSelector, addressSelector } from 'selectors/basic'

export const currentUserSelector = createSelector(
  currentSelector,
  current => current.get('user'),
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
