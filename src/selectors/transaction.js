import { createSelector } from 'reselect'

import { transactionSelector } from 'selectors/basic'

export const allTxsSelector = createSelector(
  [transactionSelector],
  transactions => transactions && transactions.reverse().toJS(),
)
