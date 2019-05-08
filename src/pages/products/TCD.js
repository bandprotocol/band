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

import TCDSrc from 'images/product-tcd.svg'
import TCDWorkSrc from 'images/tcd-work.svg'
import TCDPriceFeed from 'images/tcd-price-feed.png'
import TCDCrossChain from 'images/tcd-cross-chain.png'

export default () => {
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={5} mb={2}>
            <H1 textAlign="center" dark>
              Token Curated DataSources
            </H1>
          </Box>
          <Text textAlign="center" width="860px" fontSize={2} lineHeight={1.94}>
            Band Protocol provides a standard framework for DApps to access
            Token Curated DataSources (TCDs). TCDs serve robust data feed from a
            network of data providers curated by community members.
          </Text>
          <Image src={TCDSrc} my="30px" />
          <Card bg="#f6f8ff" pt={4} pb={5} px="42px" width="780px">
            <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
              Without access to external data and APIs the use cases for DApps
              are limited. Existing data feed solutions such as oracles are
              either very centralized with critical single points of failure or
              are developer unfriendly such as prediction markets which are too
              illiquid to be practical to meet a DApp developers needs.
              {<br />}
              {<br />}
              Many decentralized finance and betting applications suffer in
              their security models due to their need to access to price feed
              and external event data.
            </Text>
            <Flex justifyContent="center">
              <Button variant="outline" style={{ color: '#545454' }}>
                Explore Datasets
              </Button>
              <Button variant="primary" ml={5}>
                Developer Reference
              </Button>
            </Flex>
          </Card>
        </Flex>
        <Flex flexDirection="column" alignItems="center" mb={5} mt={5}>
          <Box mb={2}>
            <H1 textAlign="center" dark>
              How TCDs work
            </H1>
          </Box>
          <Image src={TCDWorkSrc} my={4} />
        </Flex>
      </PageContainer>
      <Box bg="#f6f8ff">
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
              Curated data sources have a wide array of use cases depending on
              the function of a particular dApp. Examples include:
            </Text>
            <Flex justifyContent="center" mt={5}>
              <FeatureCard
                subtitle="On-chain, decentralized"
                title="Market Price Feeds"
                content="Take crypto-fiat price feed to power decentralized lendings, exchanges and payment services."
                linkText="Integrate Price Feed in DeFi"
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
                  background: '#ffffff',
                }}
                mr="36px"
              >
                <Image mt="auto" src={TCDPriceFeed} width="100%" />
              </FeatureCard>

              <FeatureCard
                subtitle="Trustless Reports of"
                title="Cross-chain Events"
                content="Enable multi-chain atomic swap, supercharge DApps, and make true blockchain-agnostic apps."
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
                  background: '#ffffff',
                }}
                linkText="Explore Ideas"
              >
                <Box ml={4} mt="auto">
                  <Image src={TCDCrossChain} height="105px" />
                </Box>
              </FeatureCard>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>
      <Box bg="#f6f8ff" style={{ height: 180 }} />
      <Box mb="-80px" style={{ background: '#17192e', color: '#ffffff' }}>
        <StartBuilding style={{ transform: 'translateY(-50%)' }} />
      </Box>
    </Box>
  )
}
