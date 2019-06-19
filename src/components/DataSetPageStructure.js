import React from 'react'
import styled from 'styled-components'
import Breadcrumb from 'components/Breadcrumb'
import { Box, Flex } from 'ui/common'
import PageContainer from 'components/PageContainer'
import colors from 'ui/colors'
import DataSetHeaderSrc from 'images/dataset-header.svg'
import IntegrationHeader from 'images/integrationHeader.svg'

const Covers = [DataSetHeaderSrc, IntegrationHeader]

const Header = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  mb: '50px',
})`
  color: ${colors.white};
  background-image: url(${props =>
    props.bgIndex ? Covers[props.bgIndex] : Covers[0]});
  background-size: cover;
  background-position: center;
  height: 240px;
  border-radius: 8px;
`

export default ({
  communityAddress,
  name,
  children,
  bgIndex,
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
      <Header bgIndex={bgIndex}>{renderHeader()}</Header>
      {children}
    </PageContainer>
  </Box>
)
