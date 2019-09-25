import createReducer from 'reducers/creator'

import {
  ADD_TX,
  SAVE_TXS,
  SAVE_HIDDEN_TXS,
  HIDE_TXS,
  ADD_PENDING_TX,
  REMOVE_PENDING_TX,
} from 'actions'
import { Map, List, Set } from 'immutable'

const handleAddTx = (state, { txHash, title, txType, network, userAddress }) =>
  state.set(
    'txs',
    state.get('txs', List()).push(
      Map({
        txHash,
        type: txType,
        title,
        status: 'SENDING',
        userAddress,
        network,
        confirm: 0,
      }),
    ),
  )

const handleSaveTxs = (state, { currentBlock, txs, force }) => {
  if (
    force ||
    (state.get('txs').size === txs.size &&
      state.get('currentBlock') !== currentBlock)
  )
    return state.set('currentBlock', currentBlock).set('txs', txs)
  else return state
}

const handleSaveHiddenTxs = (state, { txs }) => {
  return state.set('hide', (state.get('hide') || new Set()).union(txs))
}

const handleHideTxs = state => {
  const txs = Set(
    state
      .get('txs', List())
      .map(tx => tx.get('txHash'))
      .toJS(),
  )
  return state.set('hide', txs)
}

const handleAddPendingTx = (state, { id, title, txType }) =>
  state.set(
    'pending',
    state
      .get('pending', Map())
      .set(id, Map({ title, type: txType, status: 'PENDING' })),
  )

const handleRemovePendingTx = (state, { id }) =>
  state.set('pending', state.get('pending').delete(id))

export default createReducer({
  [ADD_TX]: handleAddTx,
  [SAVE_TXS]: handleSaveTxs,
  [SAVE_HIDDEN_TXS]: handleSaveHiddenTxs,
  [HIDE_TXS]: handleHideTxs,
  [ADD_PENDING_TX]: handleAddPendingTx,
  [REMOVE_PENDING_TX]: handleRemovePendingTx,
})
