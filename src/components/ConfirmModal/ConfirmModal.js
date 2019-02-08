import { connect } from 'react-redux'

import ConfirmModalRender from './ConfirmModalRender'
import { txConfirmationSelector } from 'selectors/transaction'

import { hideModal } from 'actions'
const mapStateToProps = (state, { txHash }) => {
  const confirmation = txConfirmationSelector(state, { txHash })
  return {
    confirmationNumber: confirmation.get('confirmationNumber'),
    // TODO: URL will depend on networkID.
    txLink: `https://rinkeby.etherscan.io/tx/${txHash}`,
  }
}

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmModalRender)
