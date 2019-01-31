import React from 'react'
import { Flex } from 'ui/common'

import CommunityDescription from 'components/CommunityDescription/CommunityDescription'
import History from 'containers/History'
import BuySell from 'containers/BuySell'

export default ({ communityName }) => (
  <Flex flexDirection="column" m="0 auto">
    <CommunityDescription communityName={communityName} />
    <BuySell communityName={communityName} />
    <History communityName={communityName} />
  </Flex>
)
