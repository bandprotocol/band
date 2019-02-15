import React from 'react'

import PageContainer from 'components/PageContainer'
import { Text } from 'ui/common'
import colors from 'ui/colors'

export default ({ communityName }) => (
  <PageContainer withSidebar>
    <Text fontSize={6} color={colors.purple.normal} textAlign="center" pt={6}>
      Coming Soon.
    </Text>
  </PageContainer>
)
