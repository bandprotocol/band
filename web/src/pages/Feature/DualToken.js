import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import FilledButton from 'components/FilledButton'
import {
  Flex,
  Text,
  BackgroundCard,
  H1,
  Highlight,
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
import DualTokenSrc from 'images/featured/dual-token.png'
import DataSetTokenSrc from 'images/featured/dataset-token.png'
import DataSetTokenSrc2 from 'images/featured/dataset-token-2.png'
import BondingCurveSrc from 'images/featured/bonding-curve.png'

const OvalNumber = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
})`
  border-radius: 50%;
  width: 44px;
  height: 44px;
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
      <Box pt="60px" bg="white">
        <PageContainer>
          <Flex
            pt={['20px', '100px']}
            pb={['30px', '60px']}
            alignItems="center"
            flexDirection="column"
          >
            <Text
              lineHeight={['45px', '80px']}
              fletterSpacing="1px"
              fontSize={['24px', '48px']}
              fontWeight="bold"
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
              fontFamily="bio-sans"
            >
              Incentivising Adoptions through
              <br />
              Dual-Token Economics
            </Text>
            <Text
              textAlign="center"
              my="20px"
              lineHeight={['20px', '36px']}
              fontSize={['14px', '18px']}
              color="#323232"
              style={{ maxWidth: '970px' }}
            >
              Band Protocol functions on two types of tokens: Dataset Tokens and
              BAND Token. Here's how we use the two tokens to create economic
              incentives that allow users to support the creation of reliable
              and accessible datasets.
            </Text>
            <Image
              src={DualTokenSrc}
              style={{ maxWidth: _isMobile ? '' : '970px' }}
              mt={['0px', '30px']}
            />
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 2: Dataset Tokens */}
      <Box bg="white" mt="50px">
        <PageContainer>
          <Box m="0 auto" style={{ maxWidth: 1080 }}>
            <Flex flexDirection="row" alignItems="center">
              <OvalNumber bg="#5569de" mr="20px">
                <Text
                  lineHeight="80px"
                  fontWeight="bold"
                  fontSize="23px"
                  color="#ffffff"
                >
                  1
                </Text>
              </OvalNumber>
              <Text
                lineHeight="80px"
                fontWeight="bold"
                fontSize={['28px', '32px']}
                color="#3b426b"
                textAlign={['center', 'left']}
                fontFamily="bio-sans"
              >
                Dataset Tokens
              </Text>
            </Flex>
            <Text
              fontSize={['14px', '18px']}
              lineHeight={['20px', '36px']}
              fontWeight="300"
              color="#323232"
            >
              A dataset token is a token that anyone can buy into that grants
              the holder the right to participate in the activities that the
              community issuing the token conduct. There are two jobs for the
              dataset token holders: they can either <br />
              <Highlight
                style={{
                  fontWeight: 'bold',
                  marginRight: '5px',
                  marginLeft: '15px',
                }}
                color="#323232"
              >
                1)
              </Highlight>
              become a "data provider" who is responsible for curating
              high-quality data and feed it to smart contracts or <br />
              <Highlight
                style={{
                  fontWeight: 'bold',
                  marginRight: '5px',
                  marginLeft: '15px',
                }}
                color="#323232"
              >
                2)
              </Highlight>
              participate in the community (as a user of the data from that
              dataset) and vote for data providers they trust to do the hard
              work for them. With only the top provider gaining the right to
              contribute data to the dataset.
            </Text>
            {/* Part 1 */}
            <Flex
              mt="45px"
              flexDirection={['column', 'row']}
              justifyContent={['center', 'space-between']}
              alignItems="center"
            >
              <Flex justifyContent="center" flex={1} pr={['0px', '80px']}>
                <Image
                  src={DataSetTokenSrc}
                  style={{ maxWidth: _isMobile ? '' : 500 }}
                />
              </Flex>
              <Flex pt="12px" flex={1}>
                <Text
                  fontSize={['14px', '18px']}
                  lineHeight={['20px', '36px']}
                  my={'10px'}
                  color="#323232"
                  fontWeight="300"
                >
                  The primary source of incentive in the system is from selling
                  the data to smart contracts. Every time the data is sold, the
                  rewards get distributed to each data provider and subsequently
                  all the community users who have voted/staked for them. The
                  better providers the community select, the more trustworthy
                  the data becomes in a long run, driving up the potential
                  revenue and hence value for every token holder.
                </Text>
              </Flex>
            </Flex>

            <Flex
              flexDirection={['column-reverse', 'row']}
              justifyContent={['center', 'space-between']}
              mt="40px"
              alignItems="center"
            >
              <Flex flex={1}>
                <Text
                  fontSize={['14px', '18px']}
                  lineHeight={['20px', '36px']}
                  my={'10px'}
                  fontWeight="300"
                  color="#323232"
                >
                  This mechanism ensures that everyone involved in the process
                  of building a dataset has an aligned economic incentive.
                  Competition from multiple datasets in the same vertical
                  further drives the quality of each dataset. Eventually the
                  real beneficiaries here are all the users who benefit from the
                  more secure smart contract design.
                </Text>
              </Flex>
              <Flex justifyContent="center" pl="98.7" flex={1}>
                <Image
                  src={DataSetTokenSrc2}
                  style={{ maxWidth: _isMobile ? '' : 460 }}
                />
              </Flex>
            </Flex>

            {/* Part 2 */}
            <Flex flexDirection="column" mt="40px">
              <Flex flexDirection="row" alignItems="center">
                <OvalNumber bg="#5569de" mr="20px">
                  <Text
                    lineHeight="80px"
                    fontWeight="bold"
                    fontSize="23px"
                    color="#ffffff"
                  >
                    2
                  </Text>
                </OvalNumber>
                <Text
                  lineHeight="80px"
                  fontWeight="bold"
                  fontSize={['28px', '32px']}
                  color="#3b426b"
                  textAlign={['center', 'left']}
                  fontFamily="bio-sans"
                >
                  Band Tokens
                </Text>
              </Flex>
              <Flex
                flexDirection={['column', 'row']}
                justifyContent={['space-between']}
              >
                <Box>
                  <Image
                    src={BondingCurveSrc}
                    style={{ maxWidth: _isMobile ? '' : 460 }}
                  />
                </Box>
                <Flex flexDirection="column" style={{ maxWidth: '700px' }}>
                  <Text
                    fontSize={['14px', '18px']}
                    lineHeight={['20px', '36px']}
                    my={['20px']}
                    fontWeight="300"
                    color="#323232"
                  >
                    BAND token functions as collateral for dataset tokens.
                    Dataset tokens are issued and redeemed through a Bonding
                    Curve mechanism, guaranteeing instant liquidity and
                    sufficient value for correct dataset incentives to function
                    properly.
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            {/* Visualizing How Data are Curated button */}
            <Flex
              justifyContent="center"
              alignItems="center"
              mt="100px"
              mb="40px"
            >
              <FilledButton
                message={
                  _isMobile
                    ? 'Visualizing Curated Data'
                    : 'Next: Visualizing How Data are Curated'
                }
                arrow
                fontSize={_isMobile ? '14px' : '16px'}
                width={['300px', '500px']}
                to="/features/tcd"
              />
            </Flex>
          </Box>
        </PageContainer>
      </Box>
    </Box>
  )
}
