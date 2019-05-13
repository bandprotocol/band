import React from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import { colors } from 'ui'
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

import StartBuilding from 'components/StartBuilding'
import DataTokenization from 'images/dataTokenization.png'
import IssuanceImg from 'images/start-up.svg'
import GovernanceImg from 'images/governanceImg.png'
import StakingImg from 'images/coins.svg'

export default () => {
  const _isMobile = isMobile()
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={[4, 5]} mb={[3, 4]}>
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              Data Tokenization
            </Text>
          </Box>
          <Text
            textAlign={['left', 'center']}
            width={['calc(100vw - 40px)', '860px']}
            fontSize={['16px', '18px']}
            lineHeight={[1.63, 1.94]}
          >
            In Web 2.0, users lack data sovereignty as most business models rely
            on user data for monetization. Web 3.0 provides an opportunity for
            new business models to emerge where users retain control and
            sovereignty over their data through tokenization.
          </Text>
          <Image
            src={DataTokenization}
            my={['30px', '70px']}
            width={['calc(100vw - 40px)', '620px']}
          />
          <Card
            bg="#f6f8ff"
            pt={4}
            pb={['30px', 5]}
            px={['20px', '40px']}
            width={['calc(100vw - 40px)', '840px']}
          >
            <Text
              textAlign={['left', 'center']}
              color="#4c4c4c"
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              For effective data tokenization there must be standard frameworks
              for token issuance and valuation. Band has devised innovative
              bonding curves to effectively manage token issuance, liquidity and
              price discovery. The band token also helps to properly
              incentivized data curators in order to create an ecosystem of
              high-quality data sources.
              <br />
              <br /> Along with standard tokenization frameworks and incentives,
              Band will also provide toolkits for developers to deploy their own
              tokenized solutions with ease.
            </Text>
            <Flex justifyContent="center" mt={['30px', '45px']}>
              <AbsoluteLink href="https://developer.bandprotocol.com/">
                <Button
                  variant="primary"
                  fontSize="16px"
                  style={{
                    height: '45px',
                    width: _isMobile ? '250px' : '280px',
                    padding: _isMobile ? '0px' : null,
                  }}
                  css={{
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      backgroundColor: '#5269ff',
                    },
                  }}
                >
                  Create data-curation community
                </Button>
              </AbsoluteLink>
            </Flex>
          </Card>
        </Flex>
        <Flex my={['15px', '35px']} />
      </PageContainer>
      <Box bg="#fafafa" mb={['425px', '0px']}>
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" pb={[5, '200px']}>
            <Box mt={['45px', 5]} mb={['25px', 2]}>
              <Text
                textAlign="center"
                fontSize={['24px', '38px']}
                fontWeight={900}
                color="#2a304e"
              >
                Use Cases
              </Text>
            </Box>
            <Text
              textAlign="center"
              width={['calc(100vw - 40px)', '555px']}
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Data tokenization includes a plethora of use cases across the Band
              ecosystem Some prominent examples include:
            </Text>
            <Flex
              justifyContent="center"
              alignItems={['center', 'flex-start']}
              flexDirection={['column', 'row']}
              mt={['30px', '70px']}
              width={1}
            >
              <Flex mx={['0px', '40px']} my={['30px', '0px']} />
              <Flex flex={1} flexDirection="column" alignItems="flex-start">
                <Image src={IssuanceImg} height="100px" />
                <Text
                  mt="35px"
                  color="#2a304e"
                  fontSize="24px"
                  fontWeight={900}
                >
                  Issuance
                </Text>
                <Flex mt="15px" style={{ maxWidth: '240px' }}>
                  <Text lineHeight={1.5} color="#4c4c4c">
                    Deposit in the bonding curve to govern each dataset
                  </Text>
                </Flex>
              </Flex>
              <Flex mx={['0px', '40px']} my={['30px', '0px']} />
              <Flex flex={1} flexDirection="column" alignItems="flex-start">
                <Image src={GovernanceImg} height="100px" />
                <Text
                  mt="35px"
                  color="#2a304e"
                  fontSize="24px"
                  fontWeight={900}
                >
                  Governance
                </Text>
                <Flex mt="15px" style={{ maxWidth: '240px' }}>
                  <Text lineHeight={1.5} color="#4c4c4c">
                    Participate in a robust governance process
                  </Text>
                </Flex>
              </Flex>
              <Flex mx={['0px', '40px']} my={['30px', '0px']} />
              <Flex flex={1} flexDirection="column" alignItems="flex-start">
                <Image src={StakingImg} height="100px" />
                <Text
                  mt="35px"
                  color="#2a304e"
                  fontSize="24px"
                  fontWeight={900}
                >
                  Staking
                </Text>
                <Flex mt="15px" style={{ maxWidth: '240px' }}>
                  <Text lineHeight={1.5} color="#4c4c4c">
                    Secure the network and data integrity via a delegated proof
                    of stake (DPoS) mechanism
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>
      <Box
        mb={['-350px', '-80px']}
        style={{ background: '#17192e', color: '#ffffff' }}
      >
        <StartBuilding
          style={{ transform: `translateY(-${_isMobile ? 60 : 50}%)` }}
        />
      </Box>
    </Box>
  )
}
