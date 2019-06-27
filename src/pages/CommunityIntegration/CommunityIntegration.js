import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import CommunityIntegrationRender from './CommunityIntegrationRender'

const CommunityIntegration = props => <CommunityIntegrationRender {...props} />

const mapStateToProps = (state, { communityAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  if (!community) return {}

  let tcdPrefix = null
  try {
    tcdPrefix = community
      .get('tcds')
      .get(tcdAddress)
      .get('prefix')
      .slice(0, -1)
  } catch (e) {}

  return {
    name: community.get('name'),
    address: community.get('address'),
    tcdPrefix: tcdPrefix,
  }
}

export default connect(mapStateToProps)(CommunityIntegration)
