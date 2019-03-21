import createReducer from 'reducers/creator'

import { ADD_TX, SAVE_TXS } from 'actions'
import { Map, List } from 'immutable'

const handleAddTx = (state, { txHash, title, txType }) =>
  state.set(
    'txs',
    state.get('txs', List()).push(
      Map({
        txHash,
        type: txType,
        title,
        status: 'SENDING',
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

export default createReducer({
  [ADD_TX]: handleAddTx,
  [SAVE_TXS]: handleSaveTxs,
})
