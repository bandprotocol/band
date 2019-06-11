import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { showModal } from 'actions'
import { communityDetailSelector } from 'selectors/communities'
import { bandPriceSelector } from 'selectors/bandPrice'
import { numHolders } from 'selectors/holder'

import CommunityDetailRender from './CommunityDetailRender'

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
    tcd: community.get('tcd') && community.get('tcd').toJS(),
    tcr: community.get('tcr'),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CommunityDetailRender),
)
