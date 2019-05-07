import React from 'react'
import styled from 'styled-components'
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

import FeatureCard from 'components/FeatureCard'
import StartBuilding from 'components/StartBuilding'

import TCRSrc from 'images/tcr.svg'

export default () => {
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={5} mb={2}>
            <H1 textAlign="center" dark>
              Data Tokenization
            </H1>
          </Box>
          <Text textAlign="center" width="860px" fontSize={2} lineHeight={1.94}>
            In Web 2.0, users lack data sovereignty as most business models rely
            on user data for monetization. Web 3.0 provides an opportunity for
            new business models to emerge where users retain control and
            sovereignty over their data through tokenization.
          </Text>
          <Flex my="100px" />
          <Card bg="#f0f2ff" py="50px" px="80px" width="940px">
            <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
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
            <Flex justifyContent="center">
              <Button variant="primary">Create data-curation community</Button>
            </Flex>
          </Card>
        </Flex>
        <Flex my="50px" />
      </PageContainer>
      <Box bg="#fafafa">
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" pb={5}>
            <Box mt={5} mb={2}>
              <H1 textAlign="center" dark>
                Use Cases
              </H1>
            </Box>
            <Text
              textAlign="center"
              width="555px"
              fontSize={2}
              lineHeight={1.94}
            >
              Data tokenization includes a plethora of use cases across the Band
              ecosystem Some prominent examples include:
            </Text>
            <Flex justifyContent="center" mt={6} width={1}>
              <Flex mx="40px" />
              <Flex flex={1} flexDirection="column">
                <Text color="#2a304e" fontSize="24px" fontWeight={900}>
                  Issuance
                </Text>
                <Flex mt="15px" style={{ maxWidth: '240px' }}>
                  <Text lineHeight={1.5} color="#4c4c4c">
                    Deposit in the bonding curve to govern each dataset
                  </Text>
                </Flex>
              </Flex>
              <Flex mx="40px" />
              <Flex flex={1} flexDirection="column">
                <Text color="#2a304e" fontSize="24px" fontWeight={900}>
                  Governance
                </Text>
                <Flex mt="15px" style={{ maxWidth: '240px' }}>
                  <Text lineHeight={1.5} color="#4c4c4c">
                    Participate in a robust governance process
                  </Text>
                </Flex>
              </Flex>
              <Flex mx="40px" />
              <Flex flex={1} flexDirection="column">
                <Text color="#2a304e" fontSize="24px" fontWeight={900}>
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
      <Box bg="#f0f2ff" style={{ height: 180 }} />
      <Box mb="-80px" style={{ background: '#17192e', color: '#ffffff' }}>
        <StartBuilding style={{ transform: 'translateY(-50%)' }} />
      </Box>
    </Box>
  )
}
