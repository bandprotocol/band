import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import CommunityIntegrationRender from './CommunityIntegrationRender'
import { tcdsSelector } from 'selectors/tcd'
import { getTCDInfomation } from 'utils/tcds'

const CommunityIntegration = props => <CommunityIntegrationRender {...props} />

const mapStateToProps = (state, { communityAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  if (!community) return {}

  let tcdPrefix = null
  const tcd = tcdsSelector(state, { address: communityAddress, tcdAddress })
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
    tcdName: tcd && getTCDInfomation(tcd.toJS().prefix).label,
  }
}

export default connect(mapStateToProps)(CommunityIntegration)
