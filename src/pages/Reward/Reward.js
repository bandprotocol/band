import React from 'react'

import PageContainer from 'components/PageContainer'

import RewardDashboard from 'components/RewardDashboard'

export default ({ communityName }) => (
  <PageContainer>
    <RewardDashboard communityName={communityName} logined={true} />
  </PageContainer>
)
