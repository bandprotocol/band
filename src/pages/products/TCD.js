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

import HeroSrc from 'images/landing-hero.svg'

export default class LandingPage extends React.Component {
  render() {
    return (
      <Box>
        <PageContainer>
          <Box py={5}>
            <H1 textAlign="center" dark>
              Token Curated DataSources
            </H1>
          </Box>
          <Card bg="#fafafa" py={4} px={4} mb={5}>
            <Text textAlign="center">
              Without access to external data and APIs the use cases for DApps
              are limited. Existing data feed solutions such as oracles are
              either very centralized with critical single points of failure or
              are developer unfriendly such as prediction markets which are too
              illiquid to be practical to meet a DApp developers needs. Many
              decentralized finance and betting applications suffer in their
              security models due to their need to access to price feed and
              external event data..
            </Text>
          </Card>
        </PageContainer>
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
