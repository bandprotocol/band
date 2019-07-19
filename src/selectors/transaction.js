import { createSelector } from 'reselect'

import { transactionSelector } from 'selectors/basic'

import { List, Map } from 'immutable'

export const allTxsSelector = createSelector(
  [transactionSelector],
  transactions => transactions.get('txs'),
)

export const transactionHiddenSelector = createSelector(
  [transactionSelector],
  transactions => transactions.get('hide'),
)

export const txIncludePendingSelector = createSelector(
  transactionSelector,
  transactions =>
    transactions
      .get('pending', Map())
      .valueSeq()
      .concat(transactions.get('txs', List()).reverse())
      .toJS(),
)
