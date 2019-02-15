import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import SidebarRender from 'components/Sidebar/SidebarRender'

import { communityDetailSelector } from 'selectors/communities'
import { bandPriceSelector } from 'selectors/bandPrice'
import { currentUserSelector } from 'selectors/current'

class SideBar extends React.Component {
  state = {
    isSymbol: true,
  }

  toggleBalance() {
    this.setState({
      isSymbol: !this.state.isSymbol,
    })
  }

  render() {
    const {
      logedin,
      name,
      src,
      balance,
      symbol,
      communityPrice,
      bandPrice,
    } = this.props
    const balanceToggled =
      this.state.isSymbol || !balance
        ? balance
        : balance.communityToBand(communityPrice).bandToUSD(bandPrice)

    return (
      <SidebarRender
        logedin={logedin}
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

const mapStateToProps = (state, { communityName }) => {
  const community = communityDetailSelector(state, { name: communityName })
  if (!community) return {}
  return {
    logedin: !!currentUserSelector(state),
    name: communityName,
    src: community.get('logo'),
    balance: community.get('balance'),
    symbol: community.get('symbol'),
    communityPrice: community.get('price'),
    bandPrice: bandPriceSelector(state),
  }
}

export default withRouter(connect(mapStateToProps)(SideBar))
