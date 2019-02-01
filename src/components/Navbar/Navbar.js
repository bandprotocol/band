import React from 'react'

import BN from 'utils/bignumber'
import NavbarRender from './NavbarRender'

export default class Navbar extends React.Component {
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
