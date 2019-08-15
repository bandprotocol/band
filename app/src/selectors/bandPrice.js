import { createSelector } from 'reselect'

import { bandSelector } from 'selectors/basic'

export const bandPriceSelector = createSelector(
  [bandSelector],
  band => band.get('latestPrice'),
)
