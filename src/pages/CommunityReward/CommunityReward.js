import React from 'react'

import PageContainer from 'components/PageContainer'

import RewardDashboard from 'components/RewardDashboard'

export default ({ communityAddress }) => (
  <PageContainer withSidebar>
    <RewardDashboard communityAddress={communityAddress} />
  </PageContainer>
)
