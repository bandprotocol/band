import React from 'react'
import styled from 'styled-components'
import Breadcrumb from 'components/Breadcrumb'
import { Box, Flex } from 'ui/common'
import PageContainer from 'components/PageContainer'
import colors from 'ui/colors'
import DatasetHeader from 'images/provider-header.svg'

const Header = styled(Flex).attrs({
  alignItems: 'center',
  flexDirection: 'column',
  mb: '32px',
  bg: '#e3ecff',
})`
  color: ${colors.white};
  height: ${p => (p.noSubheader ? '185px' : '245px')};
  border-radius: 10px;
`

const HeaderImage = styled(Flex).attrs({
  width: '100%',
  alignItems: 'center',
})`
  height: 185px;
  background-image: url(${p => p.headerImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  ${p => p.noSubheader && 'border-radius: 10px;'}
`

export default ({
  communityAddress,
  tcdAddress,
  name,
  tcdName,
  children,
  breadcrumb = { path: 'dataset', label: 'Explore data' },
  renderHeader = () => null,
  renderSubheader = () => null,
  headerStyle = {},
  headerImage = DatasetHeader,
  noSubheader = false,
}) => (
  <Box width="100%">
    <PageContainer withSidebar>
      <Flex style={{ minWidth: '100%', minHeight: '60px' }} />
      {tcdAddress ? (
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
      ) : (
        <Breadcrumb
          links={[
            { path: `/community/${communityAddress}`, label: name },
            {
              path: `/community/${communityAddress}/${breadcrumb.path}`,
              label: breadcrumb.label,
            },
          ]}
        />
      )}
      <Header style={headerStyle} noSubheader={noSubheader}>
        <HeaderImage noSubheader={noSubheader} headerImage={headerImage}>
          {renderHeader()}
        </HeaderImage>
        {renderSubheader()}
      </Header>
      {children}
    </PageContainer>
  </Box>
)
