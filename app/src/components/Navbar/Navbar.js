import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import NavbarRender from './NavbarRender'
import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'
import { bandPriceSelector } from 'selectors/bandPrice'
import { txIncludePendingSelector } from 'selectors/transaction'
import { walletSelector } from 'selectors/wallet'
import { showModal, hideModal } from 'actions'

class Navbar extends React.Component {
  state = {
    isBAND: true,
    showBlockTransactions: false,
    showSignOut: false,
    isWalletShow: false,
    showNav: true,
  }

  componentDidMount() {
    window.document.body.addEventListener(
      'scroll',
      this.handleScroll.bind(this),
    )
  }

  handleScroll(e) {
    if (e.target.scrollTop < 80) {
      if (!this.state.showNav) this.setState({ showNav: true })
      return
    }
    const newST = Math.floor(e.target.scrollTop)
    if (!this.scrollHistory || this.scrollHistory.length === 0) {
      this.scrollHistory = [0]
    }
    if (this.scrollHistory.length === 1) {
      this.setState({ showNav: false })
    } else {
      if (
        this.scrollHistory[0] < this.scrollHistory[1] &&
        this.scrollHistory[1] > newST
      ) {
        this.setState({ showNav: true })
      } else if (
        this.scrollHistory[0] > this.scrollHistory[1] &&
        this.scrollHistory[1] < newST
      ) {
        this.setState({ showNav: false })
      }
    }
    this.scrollHistory = [
      this.scrollHistory[this.scrollHistory.length - 1],
      newST,
    ]
  }

  toggleBalance() {
    this.setState({
      isBAND: !this.state.isBAND,
    })
  }

  toggleBlockTransactions() {
    this.setState({
      showBlockTransactions: !this.state.showBlockTransactions,
      showSignOut: false,
      isWalletShow: false,
    })
  }

  signOut() {
    this.props.wallet.signOut()
    this.toggleSignOut()
    // window.location.reload()
  }

  toggleSignOut() {
    this.setState({
      showSignOut: !this.state.showSignOut,
      showBlockTransactions: false,
      isWalletShow: false,
    })
  }

  showWallet() {
    const { wallet } = this.props
    if (!wallet) {
      return
    }
    if (this.state.isWalletShow) {
      wallet.hide()
    } else {
      wallet.showWallet()
    }
    this.setState({
      isWalletShow: !this.state.isWalletShow,
      showBlockTransactions: false,
      showSignOut: false,
    })
  }

  render() {
    const walletType = localStorage.getItem('walletType')
    const { balance, price } = this.props
    const balanceToggled =
      this.state.isBAND || !balance ? balance : balance.bandToUSD(price)

    return (
      <NavbarRender
        {...this.state}
        {...this.props}
        walletType={walletType}
        showWallet={() => this.showWallet()}
        balance={balanceToggled}
        signOut={() => this.signOut()}
        toggleSignOut={this.toggleSignOut.bind(this)}
        toggleBalance={this.toggleBalance.bind(this)}
        onClickOutside={() =>
          this.setState({
            showBlockTransactions: false,
            showSignOut: false,
            isWalletShow: false,
          })
        }
        toggleShowBlockTransactions={this.toggleBlockTransactions.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    wallet: walletSelector(state),
    user: currentUserSelector(state),
    balance: bandBalanceSelector(state),
    price: bandPriceSelector(state),
    txs: txIncludePendingSelector(state),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideModal: () => dispatch(hideModal()),
  showLoginModal: () => dispatch(showModal('LOGIN')),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Navbar),
)
