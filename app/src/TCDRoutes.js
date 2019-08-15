import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { tcdsSelector } from 'selectors/tcd'

import CommunityDataSetPage from 'pages/CommunityDataSet'
import CommunityIntegrationPage from 'pages/CommunityIntegration'
import CommunityDataProviderPage from 'pages/CommunityDataProvider'
import DatasetActivityLogsPage from 'pages/DatasetActivityLogs'

const TCDRoutes = ({ path, communityAddress, tcdAddress, redirect }) => {
  if (redirect) {
    return <Redirect to={`/community/${communityAddress}/overview`} />
  }

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
        <CommunityIntegrationPage
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
      return (
        <DatasetActivityLogsPage
          communityAddress={communityAddress}
          tcdAddress={tcdAddress}
        />
      )
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
  const tcd = tcdsSelector(state, {
    address: communityAddress,
    tcdAddress,
  })
  return {
    communityAddress,
    tcdAddress,
    path,
    redirect: !tcd,
  }
}

export default withRouter(connect(mapStateToProps)(TCDRoutes))
