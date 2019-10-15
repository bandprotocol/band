import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { showModal } from 'actions'
import { communityDetailSelector } from 'selectors/communities'
import { bandPriceSelector } from 'selectors/bandPrice'
import { numHolders } from 'selectors/holder'

import { currentNetworkSelector } from 'selectors/current'
import CommunityDetailRender from './CommunityDetailRender'
import { convertFromChain } from 'utils/helper'

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  showBuy: () => dispatch(showModal('BUY', { tokenAddress })),
  showSell: () => dispatch(showModal('SELL', { tokenAddress })),
})

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })

  const numberOfHolders = numHolders(state, {
    address: tokenAddress,
  })

  if (!community) return {}
  const pastMarketCap =
    convertFromChain(community.get('last24HrsTotalSupply'), 'TOKEN')[0] *
    community.get('last24HrsPrice')
  const currentMarketCap = community.get('marketCap')
  return {
    numberOfHolders: numberOfHolders,
    bandPrice: bandPriceSelector(state),
    name: community.get('name'),
    address: tokenAddress,
    symbol: community.get('symbol'),
    src: community.get('logo'),
    link: community.get('website'),
    organization: community.get('organization'),
    description: community.get('description'),
    price: community.get('price'),
    marketCap: community.get('marketCap'),
    totalSupply: community.get('totalSupply'),
    curveMultiplier: community.get('curveMultiplier'),
    marketCapChanged:
      ((currentMarketCap - pastMarketCap) / pastMarketCap) * 100,
    totalSupplyChanged: community
      .get('totalSupply')
      .calculateChanged(community.get('last24HrsTotalSupply')),
    collateralEquation: community.get('collateralEquation'),
    // TODO: Summary multiple TCD
    network: currentNetworkSelector(state),
    // tcd: community.get('tcd') && community.get('tcd').toJS(),
    tcr: community.get('tcr'),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CommunityDetailRender),
)
