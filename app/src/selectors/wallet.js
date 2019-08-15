import { createSelector } from 'reselect'

import { bandSelector } from 'selectors/basic'

export const walletSelector = createSelector(
  [bandSelector],
  band => band.get('wallet'),
)

export const web3Selector = createSelector(
  [bandSelector],
  band => band.get('web3'),
)
