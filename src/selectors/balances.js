import { createSelector } from 'reselect'

import { bandSelector } from 'selectors/basic'

export const bandBalanceSelector = createSelector(
  [bandSelector],
  band => band.get('balance'),
)
