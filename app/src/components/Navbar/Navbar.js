import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import NavbarRender from './NavbarRender'
import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'
import { bandPriceSelector } from 'selectors/bandPrice'
import { txIncludePendingSelector } from 'selectors/transaction'
import { walletSelector } from 'selectors/wallet'

class Navbar extends React.Component {
  state = {
    isBND: true,
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
      isBND: !this.state.isBND,
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
    window.location.reload()
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
    const { balance, price } = this.props
    const balanceToggled =
      this.state.isBND || !balance ? balance : balance.bandToUSD(price)

    return (
      <NavbarRender
        {...this.state}
        {...this.props}
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

export default withRouter(connect(mapStateToProps)(Navbar))
