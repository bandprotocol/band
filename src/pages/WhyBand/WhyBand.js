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

import TCRSrc from 'images/tcr.svg'
import TCRWorkSrc from 'images/tcr-work.png'

import SSExample1 from 'images/SSExample1.png'

export default () => {
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={5} mb={2}>
            <H1 textAlign="center" dark>
              Why Band Protocol
            </H1>
          </Box>
          <Text textAlign="center" width="860px" fontSize={2} lineHeight={1.94}>
            Availability and reliability are the two main problems when
            incorporating data into any application. Band Protocol solves the
            problem using incentive structures of token to make sure data is
            accurate, while utilizing open nature of blockchain to distribute
            data.
          </Text>
          <Flex my="100px" />
          <Card bg="#f0f2ff" py="40px" px="42px" width="780px">
            <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
              Band is an end-to-end solution for unparalleled data curation. We
              utilize state of the art technology to provide a component layer
              solution for managing data in the Web3 technology stack.
              <br />
              <br />
              Band provides a standard framework for community curated data
              governance. This in turn enables Band to create a socially
              scalable method for the widespread adoption and integration of
              trusted data that all dApps can utilize.
            </Text>
          </Card>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          mb={5}
          mt={5}
          style={{ borderTop: '1px solid #e2e2e2' }}
          pt="50px"
        >
          <Box mb={2}>
            <H1 textAlign="center" dark>
              Two problems we solve
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
