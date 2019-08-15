import React from 'react'

import PageContainer from 'components/PageContainer'

import RewardDashboard from 'components/RewardDashboard'

export default ({ tokenAddress }) => (
  <PageContainer withSidebar>
    <RewardDashboard tokenAddress={tokenAddress} />
  </PageContainer>
)
