import React from 'react'
import styled from 'styled-components'
import Breadcrumb from 'components/Breadcrumb'
import { Box, Flex, Text } from 'ui/common'
import PageContainer from 'components/PageContainer'
import colors from 'ui/colors'
import DataSetHeaderSrc from 'images/dataset-header.svg'
import IntegrationHeader from 'images/integrationHeader.png'

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
  currentPage = { path: 'dataset', label: 'Dataset' },
  title,
  renderHeader = () => null,
}) => (
  <Box width="100%">
    <PageContainer withSidebar>
      <Breadcrumb
        links={[
          { path: `/community/${communityAddress}`, label: name },
          {
            path: `/community/${communityAddress}/${currentPage.path}`,
            label: currentPage.label,
          },
        ]}
      />
      {
        <Text
          mr={2}
          fontSize="18px"
          mt="16px"
          mb={3}
          fontWeight="900"
          color="#393939"
        >
          {title}
        </Text>
      }
      <Header bgIndex={bgIndex}>{renderHeader()}</Header>
      {children}
    </PageContainer>
  </Box>
)
