import React from 'react'

import PageContainer from 'components/PageContainer'

import CommunityDescription from 'components/CommunityDescription'
import History from 'components/History'
import BuySell from 'components/BuySell'

export default ({ communityAddress }) => (
  <PageContainer withSidebar>
    <CommunityDescription communityAddress={communityAddress} />
    <BuySell communityAddress={communityAddress} />
    <History communityAddress={communityAddress} pageSize={10} />
  </PageContainer>
)
