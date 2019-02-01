import { connect } from 'react-redux'

import BuySellModal from 'components/BuySellModal'

import { communityDetailSelector } from 'selectors/communities'
import { currentCommunityClientSelector } from 'selectors/current'

import { buyToken, sellToken } from 'actions'

const mapStateToProps = (state, { type, communityName }) => {
  const community = communityDetailSelector(state, { name: communityName })
  if (!community) return {}
  return {
    name: communityName,
    logo: community.get('logo'),
    type: type,
    communityClient: currentCommunityClientSelector(state, {
      name: communityName,
    }),
  }
}

const mapDispatchToProps = (dispatch, { communityName }) => ({
  onBuy: (amount, priceLimit) =>
    dispatch(buyToken(communityName, amount, priceLimit)),
  onSell: (amount, priceLimit) =>
    dispatch(sellToken(communityName, amount, priceLimit)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuySellModal)
