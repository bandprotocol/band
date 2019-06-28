import React from 'react'
import styled from 'styled-components'
import Breadcrumb from 'components/Breadcrumb'
import { Box, Flex } from 'ui/common'
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
  height: 180px;
  border-radius: 10px;
`

export default ({
  communityAddress,
  tcdAddress,
  name,
  tcdName,
  children,
  breadcrumb = { path: 'dataset', label: 'Explore data' },
  renderHeader = () => null,
  headerStyle = {},
}) => (
  <Box width="100%">
    <PageContainer withSidebar>
      <Breadcrumb
        links={[
          { path: `/community/${communityAddress}`, label: name },
          {
            path: `/community/${communityAddress}/${tcdAddress}`,
            label: tcdName,
          },
          {
            path: `/community/${communityAddress}/${tcdAddress}/${
              breadcrumb.path
            }`,
            label: breadcrumb.label,
          },
        ]}
      />
      <Header style={headerStyle}>{renderHeader()}</Header>
      {children}
    </PageContainer>
  </Box>
)
