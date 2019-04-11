import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import NavbarRender from './NavbarRender'

import { showModal } from 'actions'
import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'
import { bandPriceSelector } from 'selectors/bandPrice'
import { allTxsSelector } from 'selectors/transaction'
import { walletSelector } from 'selectors/wallet'

class Navbar extends React.Component {
  state = {
    isBND: true,
    showBlockTransactions: false,
  }

  toggleBalance() {
    this.setState({
      isBND: !this.state.isBND,
    })
  }

  toggleBlockTransactions() {
    this.setState({
      showBlockTransactions: !this.state.showBlockTransactions,
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
    const { balance, price, txs } = this.props
    const balanceToggled =
      this.state.isBND || !balance ? balance : balance.bandToUSD(price)

    return (
      <NavbarRender
        showWallet={() => this.showWallet()}
        isBND={this.state.isBND}
        balance={balanceToggled}
        txs={txs}
        showLogin={() => this.showWallet()}
        toggleBalance={this.toggleBalance.bind(this)}
        showBlockTransactions={this.state.showBlockTransactions}
        onClickOutside={() => this.setState({ showBlockTransactions: false })}
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
