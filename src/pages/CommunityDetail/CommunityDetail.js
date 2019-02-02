import React from 'react'
import { Flex } from 'ui/common'

import PageContainer from 'components/PageContainer'

import CommunityDescription from 'components/CommunityDescription/CommunityDescription'
import History from 'containers/History'
import BuySell from 'containers/BuySell'

export default ({ communityName }) => (
  <PageContainer withSidebar>
    <CommunityDescription communityName={communityName} />
    <BuySell communityName={communityName} />
    <History communityName={communityName} />
  </PageContainer>
)
