import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'

import CommunityIntegrationRender from './CommunityIntegrationRender'

const CommunityIntegration = props => <CommunityIntegrationRender {...props} />

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  return {
    name: community.get('name'),
    address: community.get('address'),
  }
}

export default connect(mapStateToProps)(CommunityIntegration)
