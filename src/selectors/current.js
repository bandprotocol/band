import { createSelector } from 'reselect'
import { currentSelector, nameSelector } from 'selectors/basic'

export const currentUserSelector = createSelector(
  currentSelector,
  current => current.get('user'),
)

export const currentBandClientSelector = createSelector(
  currentSelector,
  current => current.getIn(['client', 'band']),
)

export const currentCommunityClientSelector = createSelector(
  [currentSelector, nameSelector],
  (current, name) => current.getIn(['client', 'communities', name]),
)
