import React from 'react'

import PageContainer from 'components/PageContainer'

import ParameterPanel from 'components/ParameterPanel'

export default ({ communityAddress }) => (
  <PageContainer withSidebar>
    <ParameterPanel communityAddress={communityAddress} />
  </PageContainer>
)
