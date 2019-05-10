import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import NavbarRender from './NavbarRender'
import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'
import { bandPriceSelector } from 'selectors/bandPrice'
import { allTxsSelector } from 'selectors/transaction'
import { walletSelector } from 'selectors/wallet'

class Navbar extends React.Component {
  state = {
    isBND: true,
    showBlockTransactions: false,
    showSignOut: false,
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
    })
  }

  showWallet() {
    const { wallet } = this.props
    if (!wallet) {
      return
    }
    wallet.showWallet()
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
          this.setState({ showBlockTransactions: false, showSignOut: false })
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
    txs: allTxsSelector(state),
  }
}

export default withRouter(connect(mapStateToProps)(Navbar))
