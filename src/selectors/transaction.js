import { createSelector } from 'reselect'

import { transactionSelector, txHashSelector } from 'selectors/basic'

export const txConfirmationSelector = createSelector(
  [transactionSelector, txHashSelector],
  (transactions, txHash) => transactions.get(txHash),
)
