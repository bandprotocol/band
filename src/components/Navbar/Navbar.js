import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import NavbarRender from './NavbarRender'

import { showModal } from 'actions'

import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'
import { bandPriceSelector } from 'selectors/bandPrice'

class Navbar extends React.Component {
  state = {
    isBND: true,
  }

  toggleBalance() {
    this.setState({
      isBND: !this.state.isBND,
    })
  }

  render() {
    const { balance, showLogin, price } = this.props
    const balanceToggled =
      this.state.isBND || !balance ? balance : balance.bandToUSD(price)

    return (
      <NavbarRender
        isBND={this.state.isBND}
        balance={balanceToggled}
        showLogin={showLogin}
        toggleBalance={this.toggleBalance.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: currentUserSelector(state),
    balance: bandBalanceSelector(state),
    price: bandPriceSelector(state),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  showLogin: () => dispatch(showModal('LOGIN')),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Navbar),
)
