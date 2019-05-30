import React from 'react'
import styled from 'styled-components'
import Breadcrumb from 'components/Breadcrumb'
import { Box, Flex } from 'ui/common'
import PageContainer from 'components/PageContainer'
import colors from 'ui/colors'
import DataSetHeaderSrc from 'images/dataset-header.svg'

const Header = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  mb: '50px',
})`
  color: ${colors.white};
  background-image: url(${DataSetHeaderSrc});
  background-size: cover;
  background-position: center;
  height: 240px;
  border-radius: 8px;
`

export default ({
  communityAddress,
  name,
  children,
  renderHeader = () => null,
}) => (
  <Box width="100%">
    <PageContainer withSidebar>
      <Breadcrumb
        links={[
          { path: `/community/${communityAddress}`, label: name },
          {
            path: `/community/${communityAddress}/dataset`,
            label: 'Data Set',
          },
        ]}
      />
      <Header>{renderHeader()}</Header>
      {children}
    </PageContainer>
  </Box>
)
