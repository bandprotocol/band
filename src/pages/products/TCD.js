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

import FeatureCard from 'components/FeatureCard'
import StartBuilding from 'components/StartBuilding'

import Animator from 'components/Animator'

import TCDSrc from 'images/product-tcd.svg'
import TCDWorkSrc from 'images/tcd-work.svg'
import TCDWorkSrcVert from 'images/tcd-work-vert.svg'
import TCDPriceFeed from 'images/tcd-price-feed.png'
import TCDCrossChain from 'images/tcd-cross-chain.png'

import Step1Src from 'images/animate-tcd/step-1.png'
import Step2Src from 'images/animate-tcd/step-2.png'
import Step3Src from 'images/animate-tcd/step-3.png'
import Step4Src from 'images/animate-tcd/step-4.png'
import Step1ActiveSrc from 'images/animate-tcd/step-1-active.png'
import Step2ActiveSrc from 'images/animate-tcd/step-2-active.png'
import Step3ActiveSrc from 'images/animate-tcd/step-3-active.png'
import Step4ActiveSrc from 'images/animate-tcd/step-4-active.png'

import Animate1Src from 'images/animate-tcd/animate-1.png'
import Animate2Src from 'images/animate-tcd/animate-2.png'
import Animate3Src from 'images/animate-tcd/animate-3.png'
import Animate4Src from 'images/animate-tcd/animate-4.png'
import Animate5Src from 'images/animate-tcd/animate-5.png'
import Animate6Src from 'images/animate-tcd/animate-6.png'
import Animate7Src from 'images/animate-tcd/animate-7.png'

const animatorSteps = [
  {
    src: Step1Src,
    srcActive: Step1ActiveSrc,
    renderText: () =>
      'Token Curate DataSource (TCD) is a method for a community to collectively curate data. It is suitable for curating objective information with large amount of data volume such as price, blockchain transactions, and real-world events.',
  },
  {
    src: Step2Src,
    srcActive: Step2ActiveSrc,
    renderText: () =>
      'A community member can become a data provider by deploying Data Source Contract and feed the data to it. He or she then registers to become a provider candidate.',
  },
  {
    src: Step3Src,
    srcActive: Step3ActiveSrc,
    renderText: () =>
      'Token holders elect data providers by staking their token in the name of the candidates. Top providers earn the right to serve data and collect fees in return.',
  },
  {
    src: Step4Src,
    srcActive: Step4ActiveSrc,
    renderText: () =>
      'DApps access data via an aggregator function. The return data are synchronous and reliable.',
  },
]

const animatorSpites = [
  {
    src: Animate1Src,
    height: 78,
    steps: [
      [1, 212, 162, 0, 1.8], //
      [1, 302, 162], //
      [1, 347, 162], //
      [1, 136, 162], //
    ],
  },
  {
    src: Animate2Src,
    height: 62,
    steps: [
      [0, 121, 173], //
      [1, 121, 173], //
      [1, 184, 173, 0, 0.9], //
      [1, 0, 173, 0, 0.7], //
    ],
  },
  {
    src: Animate3Src,
    height: 21,
    steps: [
      [0, 160, 194], //
      [1, 187, 194], //
      [1, 240, 194, 0, 0.9], //
      [1, 40, 194, 0, 0.7], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 196, 180], //
      [1, 196, 172, 200], //
      [1, 253, 172], //
      [0, 253, 172], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 218, 180], //
      [1, 218, 172, 400], //
      [1, 277, 172], //
      [0, 277, 172], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 242, 180], //
      [1, 242, 172, 600], //
      [1, 300, 172], //
      [0, 300, 172], //
    ],
  },
  {
    src: Animate5Src,
    height: 145,
    steps: [
      [0, 60, 132], //
      [0, 60, 132], //
      [1, 77, 132], //
      [0, 60, 132], //
    ],
  },
  {
    src: Animate6Src,
    height: 209,
    steps: [
      [0, 0, 96], //
      [0, 0, 96], //
      [0, 0, 96], //
      [1, 29, 96, 300], //
    ],
  },
  {
    src: Animate7Src,
    height: 125,
    steps: [
      [0, 202, 144], //
      [0, 202, 144], //
      [0, 202, 144], //
      [1, 220, 144, 600], //
    ],
  },
]

export default () => {
  const _isMobile = isMobile()
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={[4, 5]} mb={2}>
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              Token Curated DataSources
            </Text>
          </Box>
          <Text
            textAlign={['left', 'center']}
            width={['calc(100vw - 40px)', '860px']}
            fontSize={['16px', '18px']}
            lineHeight={[1.63, 1.94]}
          >
            Band Protocol provides a standard framework for DApps to access
            Token Curated DataSources (TCDs). TCDs serve robust data feed from a
            network of data providers curated by community members.
          </Text>
          <Image src={TCDSrc} my="30px" />
          <Card
            bg="#f6f8ff"
            pt={4}
            pb={['30px', 5]}
            px="42px"
            width={['calc(100vw - 40px)', '940px']}
          >
            <Text
              textAlign={['left', 'center']}
              color="#4c4c4c"
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
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
            <Flex
              justifyContent="center"
              mt={['30px', '40px']}
              flexDirection={['column-reverse', 'row']}
            >
              <AbsoluteLink href="https://data.bandprotocol.com">
                <Button
                  variant="outline"
                  color="#545454"
                  style={{
                    height: '45px',
                    width: _isMobile ? '196px' : null,
                    padding: _isMobile ? '5px' : null,
                  }}
                  css={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#6b7df5',
                      color: 'white',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      backgroundColor: '#5269ff',
                    },
                  }}
                >
                  Explore Datasets
                </Button>
              </AbsoluteLink>
              {_isMobile && <Flex my="10px" />}
              <AbsoluteLink href="https://developer.bandprotocol.com/docs/tcd.html">
                <Button
                  variant="primary"
                  ml={[0, 5]}
                  style={{
                    height: '45px',
                    width: _isMobile ? '196px' : null,
                    padding: _isMobile ? '5px' : null,
                  }}
                  css={{
                    transition: 'all 0.2s',
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      backgroundColor: '#5269ff',
                    },
                  }}
                >
                  Developer Reference
                </Button>
              </AbsoluteLink>
            </Flex>
          </Card>
        </Flex>

        {isMobile() ? (
          <Flex flexDirection="column" alignItems="center" mb={5} mt={5}>
            <Box mb={2}>
              <H1 textAlign="center" dark>
                How TCDs work
              </H1>
            </Box>
            <Image src={TCDWorkSrcVert} my={4} />
          </Flex>
        ) : (
          <Flex
            flexDirection="column"
            alignItems="center"
            mb={5}
            mt={['30px', 5]}
            pb="400px"
          >
            <Animator
              title="How TCDs work"
              steps={animatorSteps}
              spites={animatorSpites}
            />
          </Flex>
        )}
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
              Curated data sources have a wide array of use cases depending on
              the function of a particular dApp. Examples include:
            </Text>
            <Flex
              justifyContent="center"
              flexDirection={['column', 'row']}
              mt={['30px', 5]}
            >
              <FeatureCard
                subtitle="On-chain, decentralized"
                title="Market Price Feeds"
                content="Take crypto-fiat price feed to power decentralized lendings, exchanges and payment services."
                linkText="Integrate Price Feed in DeFi"
                link={'https://data.bandprotocol.com/dataset/price'}
                isMobile={_isMobile}
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
                  background: '#ffffff',
                }}
                mr={['0px', '36px']}
              >
                <Image mt="auto" src={TCDPriceFeed} width="100%" />
              </FeatureCard>
              <FeatureCard
                subtitle="Trustless Reports of"
                title="Cross-chain Events"
                content="Enable multi-chain atomic swap, supercharge DApps, and make true blockchain-agnostic apps."
                linkText="Explore Ideas"
                link={'https://developer.bandprotocol.com/'}
                isMobile={_isMobile}
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
                  background: '#ffffff',
                }}
                mt={['30px', 0]}
              >
                <Box ml={4} mt={['-20px', '-15px']}>
                  <Image src={TCDCrossChain} height={['105px', '105px']} />
                </Box>
              </FeatureCard>
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
