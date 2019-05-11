import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { showModal } from 'actions'
import { communityDetailSelector } from 'selectors/communities'
import { bandPriceSelector } from 'selectors/bandPrice'
import { numHolders } from 'selectors/holder'

import CommunityDetailRender from './CommunityDetailRender'

class CommunityDetail extends React.Component {
  render() {
    return <CommunityDetailRender {...this.props} />
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  showBuy: () => dispatch(showModal('BUY', { communityAddress })),
  showSell: () => dispatch(showModal('SELL', { communityAddress })),
})

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  const numberOfHolders = numHolders(state, {
    address: communityAddress,
  })

  if (!community) return {}
  return {
    numberOfHolders: numberOfHolders,
    bandPrice: bandPriceSelector(state),
    name: community.get('name'),
    address: community.get('address'),
    symbol: community.get('symbol'),
    src: community.get('logo'),
    link: community.get('website'),
    organization: community.get('organization'),
    description: community.get('description'),
    price: community.get('price'),
    marketCap: community.get('marketCap'),
    totalSupply: community.get('totalSupply'),
    collateralEquation: community.get('collateralEquation'),
    tcd: community.get('tcds').get(0),
    tcr: community.get('tcr'),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CommunityDetail),
)
