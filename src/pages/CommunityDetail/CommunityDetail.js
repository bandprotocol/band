import React from 'react'

import PageContainer from 'components/PageContainer'

import CommunityDescription from 'components/CommunityDescription'
import History from 'components/History'
import BuySell from 'components/BuySell'

export default ({ communityName }) => (
  <PageContainer withSidebar>
    <CommunityDescription communityName={communityName} />
    <BuySell communityName={communityName} />
    <History communityName={communityName} pageSize={10} />
  </PageContainer>
)
