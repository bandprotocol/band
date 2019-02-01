import React from 'react'
import BN from 'utils/bignumber'

import SidebarRender from 'components/Sidebar/SidebarRender'

export default class Sidebar extends React.Component {
  state = {
    isSymbol: true,
  }

  toggleBalance() {
    this.setState({
      isSymbol: !this.state.isSymbol,
    })
  }

  render() {
    const { name, src, balance, symbol } = this.props
    const balanceToggled =
      this.state.isSymbol || !balance ? balance : balance.mul(new BN('31.24')) //TODO: HardCode BND to USD Convertion rate

    return (
      <SidebarRender
        name={name}
        src={src}
        balance={balanceToggled}
        symbol={symbol}
        isSymbol={this.state.isSymbol}
        toggleBalance={this.toggleBalance.bind(this)}
      />
    )
  }
}
