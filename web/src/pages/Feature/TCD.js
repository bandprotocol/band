import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import FilledButton from 'components/FilledButton'
import {
  Flex,
  Text,
  BackgroundCard,
  H1,
  Button,
  Card,
  Image,
  Box,
  H2,
  H3,
  AbsoluteLink,
  Link,
  Bold,
} from 'ui/common'
import { isMobile } from 'ui/media'

const OutlineButton = styled(Button)`
  font-family: Avenir;
  color: #4a4a4a;
  font-size: 16px;
  font-weight: 500;
  background-color: white;
  width: ${props => (props.isMobile ? '196px' : '182px')};
  height: 46px;
  border-radius: 2px;
  cursor: pointer;

  transition: all 0.2s;

  &:hover {
    background-color: #6b7df5;
  }

  &:active {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }
`

export default () => {
  const exRef = useRef(null)
  const _isMobile = isMobile()
  return (
    <Box
      style={{
        background: 'white',
        color: '#323232',
        overflow: 'hidden',
      }}
      mt="-80px"
    >
      {/* Section 1 */}
      <Box pt="60px" bg="f2f2f2">
        <PageContainer>
          <Flex
            pt={['50px', '100px']}
            pb={['50px', '60px']}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '48px']}
              color="#4a4a4a"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Visualizing Data Curation via
              <br />
              Token-Curated DataSource
            </Text>
            <Text
              textAlign="center"
              mt="20px"
              style={{ lineHeight: '2', maxWidth: '1000px' }}
            >
              Token-Curated DataSource (TCD) is a standard for community to
              collectively curate data. Similarly to Delegated Proof of Stake
              (dPoS) concensus, Dataset token holders collectively elect data
              providers by staking their token in the name of the candidates.
              TCD is suitable for curating high-volume, easy-to-verify,
              objective information such as price and event outcome.
            </Text>
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 3 */}
      <Box bg="white" mt="10px">
        <PageContainer>
          <Flex justifyContent="center">
            <Flex bg="pink" width="100%" style={{ height: '400px' }} />
          </Flex>

          <Flex justifyContent="center" my="50px">
            <FilledButton
              message="Next: Participating in Data Curation"
              arrow
              width="520px"
              to="/features/data-governance-portal"
            />
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
