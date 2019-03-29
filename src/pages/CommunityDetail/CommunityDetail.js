import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { showModal } from 'actions'
import { communityDetailSelector } from 'selectors/communities'

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
  // console.log(state)
  // console.log(community)
  if (!community) return {}
  return {
    name: community.get('name'),
    address: community.get('address'),
    src: community.get('logo'),
    link: community.get('website'),
    organization: community.get('organization'),
    description: community.get('description'),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CommunityDetail),
)
