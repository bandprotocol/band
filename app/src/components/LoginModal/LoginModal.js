import React from 'react'
import { connect } from 'react-redux'

import LoginModalRender from './LoginModalRender'
import { hideModal } from 'actions'

import { walletSelector } from 'selectors/wallet'

class LoginModal extends React.Component {
  showWallet() {
    const { wallet, hideLogin } = this.props
    if (!wallet) {
      return
    }
    wallet.showWallet()
    hideLogin()
  }

  render() {
    return (
      <LoginModalRender
        {...this.props}
        showWallet={() => this.showWallet()}
      ></LoginModalRender>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    wallet: walletSelector(state),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideLogin: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginModal)
