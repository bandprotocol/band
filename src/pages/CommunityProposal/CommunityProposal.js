import React from 'react'

import PageContainer from 'components/PageContainer'
import ProposalList from 'components/ProposalList'
import { Flex, Text, Box, Button } from 'ui/common'
import colors from 'ui/colors'

export default ({ communityAddress }) => (
  <PageContainer withSidebar>
    <Flex pb="50px" style={{ 'border-bottom': '1px solid #cbcfe3' }}>
      <ProposalList
        title={'Open Proposal'}
        description={
          'Recently proposed change in governance parameter. Please vote before each proposal expires.'
        }
        isActive={true}
      />
    </Flex>
    <Flex mt="25px">
      <ProposalList title={'Past Proposal'} isActive={false} />
    </Flex>
  </PageContainer>
)
