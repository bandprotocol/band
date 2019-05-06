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
      <Box style={{ color: '#ffffff' }}>
        <Box style={{ background: colors.gradient.dark }}>
          <PageContainer>
            <Flex py={5}>
              <Box flex={1}>
                <Text lineHeight={1.8} fontWeight="600" fontSize="32px">
                  Decentralized
                  <br />
                  Data Governance
                </Text>
                <Text>TODO: Q</Text>
              </Box>
              <Box flex={1}>
                <Image src={HeroSrc} height="320" />
              </Box>
            </Flex>
            <Card
              borderRadius="10px"
              bg="#36406e"
              boxShadow="0 5px 20px rgba(0, 0, 0, 0.15)"
              py={4}
            >
              <Text textAlign="center">Band Protocol is ...</Text>
            </Card>
            <Box pt={6} pb={6}>
              <Text textAlign="center">Band Protocol Provides</Text>
            </Box>
          </PageContainer>
        </Box>
        <Box py={5} style={{ background: '#242944' }}>
          <PageContainer>
            <Text textAlign="center" fontWeight="600" fontSize="32px">
              Applications Developed with Band Protocol
            </Text>
            <Flex />
          </PageContainer>
        </Box>
        <Box py={5} style={{ background: '#17192e' }}>
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
            </Card>
            <Flex />
          </PageContainer>
        </Box>
      </Box>
    )
  }
}
