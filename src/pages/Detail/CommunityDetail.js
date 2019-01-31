import React from 'react'
import { Flex } from 'ui/common'

import CommunityDescription from 'components/CommunityDescription/CommunityDescription'
import History from 'containers/History'
import BuySell from 'containers/BuySell'
import Graph from 'components/PriceGraph'

// Mock Price data for 1 year
const mockData = () => {
  const startTime = 1483228800000
  const data = [[startTime, Math.random() * 5000]]
  for (let i = 0; i < 370; i++) {
    data.push([
      startTime + i * 1000 * 60 * 60 * 24,
      Math.abs(
        data[data.length - 1][1] + Math.floor(Math.random() * 1000 - 500),
      ),
    ])
  }
  return data
}
export default ({ communityName }) => (
  <Flex flexDirection="column" m="0 auto">
    <CommunityDescription communityName={communityName} />
    <Graph data={mockData()} />
    <BuySell communityName={communityName} />
    <History communityName={communityName} />
  </Flex>
)
