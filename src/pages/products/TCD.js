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

import TCDSrc from 'images/product-tcd.svg'
import TCDWorkSrc from 'images/tcd-work.svg'
import TCDPriceFeed from 'images/tcd-price-feed.svg'
import TCDCrossChain from 'images/tcd-cross-chain.svg'

const UseCaseCard = ({ title, topic, description, image, footer, link }) => (
  <Card
    pt={4}
    px={4}
    style={{
      width: '405px',
      borderRadius: '10px',
      boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
      backgroundColor: '#ffffff',
    }}
  >
    <Flex flexDirection="column" style={{ height: '100%' }}>
      <Text fontSize={1} fontWeight="bold" color="#6b8bf5" mb={2}>
        {title}
      </Text>
      <Text fontSize={4} fontWeight="bold" color="#2b314f" mb={3}>
        {topic}
      </Text>
      <Text fontSize={0} color="#4c4c4c" mb={4}>
        {description}
      </Text>
      <Flex flexDirection="column">
        <Image src={image} />
      </Flex>
      <Flex flexDirection="column" mt="auto">
        <Box mx="-32px" style={{ borderBottom: '1px solid #fafafa' }} />
        <Flex>
          <Text fontSize={1} color="#252945" py={3}>
            {footer}
          </Text>
          <Text fontSize={1} color="#6b8bf5" fontWeight="bold" py={3} ml="auto">
            >
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)

export default class LandingPage extends React.Component {
  render() {
    return (
      <Box>
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" mb={4}>
            <Box mt={5} mb={2}>
              <H1 textAlign="center" dark>
                Token Curated DataSources
              </H1>
            </Box>
            <Text
              textAlign="center"
              width="860px"
              fontSize={2}
              lineHeight={1.94}
            >
              Band Protocol provides a standard framework for DApps to access
              Token Curated DataSources (TCDs). TCDs serve robust data feed from
              a network of data providers curated by community members.
            </Text>
            <Image src={TCDSrc} my={5} />
            <Card bg="#fafafa" pt={4} pb={5} px="42px" width="780px">
              <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
                Without access to external data and APIs the use cases for DApps
                are limited. Existing data feed solutions such as oracles are
                either very centralized with critical single points of failure
                or are developer unfriendly such as prediction markets which are
                too illiquid to be practical to meet a DApp developers needs.
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
          <Flex flexDirection="column" alignItems="center" mb={5}>
            <Box mb={2}>
              <H1 textAlign="center" dark>
                How TCDs work
              </H1>
            </Box>
            <Image src={TCDWorkSrc} my={4} />
          </Flex>
        </PageContainer>
        <Box bg="#fafafa">
          <PageContainer>
            <Flex flexDirection="column" alignItems="center" mb={5}>
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
                <UseCaseCard
                  title="On-chain, decentralized"
                  topic="Market Price Feeds"
                  description="Take crypto-fiat price feed to power decentralized lendings, exchanges and payment services."
                  image={TCDPriceFeed}
                  footer="Integrate Price Feed in DeFi"
                />
                <Flex width="36px" />
                <UseCaseCard
                  title="Trustless Reports of"
                  topic="Cross-chain Events"
                  description="Enable multi-chain atomic swap, supercharge DApps, and make true blockchain-agnostic apps."
                  image={TCDCrossChain}
                  footer="Explore Ideas"
                />
              </Flex>
            </Flex>
          </PageContainer>
        </Box>
        <Box py={5} style={{ background: '#17192e', color: '#ffffff' }}>
          <PageContainer>
            <Card
              borderRadius="10px"
              boxShadow="0 5px 20px rgba(0, 0, 0, 0.15)"
              py={4}
              style={{
                background: 'linear-gradient(to left, #6083ff, #8266ff)',
              }}
            >
              <Text textAlign="center" fontWeight="600" fontSize="32px">
                Want to start building?
              </Text>
              <Text textAlign="center" fontWeight="600" fontSize="32px">
                Bun: Don't code this
              </Text>
            </Card>
            <Flex />
          </PageContainer>
        </Box>
      </Box>
    )
  }
}
