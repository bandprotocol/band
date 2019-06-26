import React from 'react'
import styled from 'styled-components'
import Breadcrumb from 'components/Breadcrumb'
import { Box, Flex, Text } from 'ui/common'
import PageContainer from 'components/PageContainer'
import colors from 'ui/colors'
import DatasetHeader from 'images/provider-header.png'

const Header = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  mb: '32px',
})`
  color: ${colors.white};
  background-image: url(${DatasetHeader});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 179px;
  border-radius: 10px;
`

export default ({
  communityAddress,
  name,
  children,
  breadcrumb = { path: 'dataset', label: 'Dataset' },
  renderHeader = () => null,
}) => (
  <Box width="100%">
    <PageContainer withSidebar>
      <Breadcrumb
        links={[
          { path: `/community/${communityAddress}`, label: name },
          {
            path: `/community/${communityAddress}/${breadcrumb.path}`,
            label: breadcrumb.label,
          },
        ]}
      />
      <Header>{renderHeader()}</Header>
      {children}
    </PageContainer>
  </Box>
)
