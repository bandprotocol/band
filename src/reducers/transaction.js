import createReducer from 'reducers/creator'

import { UPDATE_CONFIRMATION } from 'actions'

const handleUpdateConfirmation = (state, { txHash, confirmationNumber }) =>
  state.setIn([txHash, 'confirmationNumber'], confirmationNumber)

export default createReducer({
  [UPDATE_CONFIRMATION]: handleUpdateConfirmation,
})
