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
import CoinHatcherShowcase from 'components/CoinHatcherShowcase'

import TCRSrc from 'images/tcr.png'
import TCRWorkSrc from 'images/tcr-work.png'

import SSExample1 from 'images/SSExample1.png'

export default class TCRPage extends React.Component {
  render() {
    return (
      <Box>
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" mb={4}>
            <Box mt={5} mb={2}>
              <H1 textAlign="center" dark>
                Token Curated Registries
              </H1>
            </Box>
            <Text
              textAlign="center"
              width="860px"
              fontSize={2}
              lineHeight={1.94}
            >
              Centralized information providers are susceptible to corruption
              and malicious behavior without appropriate checks and balances.
              Token Curated Registries enables decentralized, reliable and more
              transparent way to crowd-source information.
            </Text>
            <Image src={TCRSrc} my={5} height="280px" />
            <Card bg="#f0f2ff" pt={4} pb={5} px="42px" width="780px">
              <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
                Token curated registries provide a more reliable and transparent
                data organization mechanism. Band combines various data sources
                in order to ensure that particular registries can provide
                meaningful data quickly and reliably for users at any time.
                <br />
                <br />
                As the Band ecosystem grows with more data overtime, the
                registries continue to become more expansive with a larger
                volume of data in the feed for anyone to utilize with ease.
              </Text>
              <Flex justifyContent="center">
                <Button variant="primary">Developer Reference</Button>
              </Flex>
            </Card>
          </Flex>
          <Flex flexDirection="column" alignItems="center" mb={5} mt={5}>
            <Box mb={2}>
              <H1 textAlign="center" dark>
                How TCDRs work
              </H1>
            </Box>
            <Image src={TCRWorkSrc} my={4} />
          </Flex>
        </PageContainer>
        <Box bg="#f0f2ff">
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
              <Flex justifyContent="center" mt={4}>
                <Button variant="primary">Go to CoinHatcher</Button>
              </Flex>
            </Flex>

            <CoinHatcherShowcase
              Img1={SSExample1}
              Img2={SSExample1}
              Img3={SSExample1}
            />
          </PageContainer>
        </Box>
        <Box bg="#f0f2ff" style={{ height: 180 }} />
        <Box mb="-80px" style={{ background: '#17192e', color: '#ffffff' }}>
          <StartBuilding style={{ transform: 'translateY(-50%)' }} />
        </Box>
      </Box>
    )
  }
}
