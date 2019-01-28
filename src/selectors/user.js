import { createSelector } from 'reselect'
import { currentSelector } from './basic'

export const currentUserSelector = createSelector(
  currentSelector,
  current => current.get('user'),
)
