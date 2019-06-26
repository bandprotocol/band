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
      address,
      tcds,
    } = this.props

    return (
      <SidebarRender
        logedin={logedin}
        name={name}
        address={address}
        src={src}
        balance={balance}
        usdBalance={
          balance &&
          balance.communityToBand(communityPrice).bandToUSD(bandPrice)
        }
        tcds={tcds}
        symbol={symbol}
        isSymbol={this.state.isSymbol}
        toggleBalance={this.toggleBalance.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  if (!community) return {}
  const tcds = community.get('tcds').toJS()
  return {
    logedin: !!currentUserSelector(state),
    name: community.get('name'),
    src: community.get('logo'),
    balance: community.get('balance'),
    symbol: community.get('symbol'),
    communityPrice: community.get('price'),
    bandPrice: bandPriceSelector(state),
    address: tokenAddress,
    tcds: Object.keys(tcds).map(key => {
      return {
        address: key,
        prefix: tcds[key].prefix,
      }
    }),
  }
}

export default withRouter(connect(mapStateToProps)(SideBar))
