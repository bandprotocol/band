import React from 'react'
import { connect } from 'react-redux'
import LoginModalRender from './LoginModalRender'
import { hideModal } from 'actions'
import { walletSelector } from 'selectors/wallet'

class LoginModal extends React.Component {
  signin = async walletType => {
    // console.log(walletType)
    const { hideLogin } = this.props
    switch (walletType) {
      case 'metamask':
        if (typeof window.ethereum === 'undefined') {
          console.error('Cannot find metamask provider.')
          break
        }
        await window.ethereum.enable()
        localStorage.setItem('walletType', 'metamask')
        break
      case 'bandwallet':
        const { wallet } = this.props
        if (!wallet) {
          console.error('Cannot find band wallet')
          break
        }
        localStorage.setItem('walletType', 'bandwallet')
        wallet.showWallet()
        break
      default:
        console.error('Cannot find any wallet.')
        break
    }
    hideLogin()
  }

  render() {
    return (
      <LoginModalRender {...this.props} signin={this.signin}></LoginModalRender>
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
