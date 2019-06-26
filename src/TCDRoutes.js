import React from 'react'
import { withRouter } from 'react-router-dom'
import { Flex } from 'ui/common'
import { connect } from 'react-redux'

import CommunityDataProviderPage from 'pages/CommunityDataProvider'
import CommunityDataSetPage from 'pages/CommunityDataSet'
import CommunityIntegration from 'pages/CommunityIntegration'

const TCDRoutes = ({ path, communityAddress, tcdAddress }) => {
  switch (path) {
    case 'dataset':
      return (
        <CommunityDataSetPage
          communityAddress={communityAddress}
          tcdAddress={tcdAddress}
        />
      )
    case 'integration':
      return (
        <CommunityIntegration
          communityAddress={communityAddress}
          tcdAddress={tcdAddress}
        />
      )
    case 'governance':
      return (
        <CommunityDataProviderPage
          tokenAddress={communityAddress}
          tcdAddress={tcdAddress}
        />
      )
    case 'logs':
      return <div />
    default:
      return (
        <CommunityDataSetPage
          communityAddress={communityAddress}
          tcdAddress={tcdAddress}
        />
      )
  }
}

const mapStateToProps = (state, { communityAddress, tcdAddress, path }) => {
  return {
    communityAddress,
    tcdAddress,
    path,
  }
}

export default withRouter(connect(mapStateToProps)(TCDRoutes))
