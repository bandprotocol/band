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
import TCDWorkSrcVert from 'images/tcd-work-vert.svg'
import TCDPriceFeed from 'images/tcd-price-feed.png'
import TCDCrossChain from 'images/tcd-cross-chain.png'

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
            width={['calc(100vw - 40px)', '840px']}
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
              mt={['30px', '0px']}
              flexDirection={['column-reverse', 'row']}
            >
              <Button
                variant="outline"
                style={{
                  color: '#545454',
                  height: '45px',
                  width: _isMobile ? '196px' : null,
                  padding: _isMobile ? '5px' : null,
                }}
              >
                Explore Datasets
              </Button>
              {_isMobile && <Flex my="10px" />}
              <Button
                variant="primary"
                ml={[0, 5]}
                style={{
                  height: '45px',
                  width: _isMobile ? '196px' : null,
                  padding: _isMobile ? '5px' : null,
                }}
              >
                Developer Reference
              </Button>
            </Flex>
          </Card>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          mb={5}
          mt={['30px', 5]}
        >
          <Box mb={2}>
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              How TCDs work
            </Text>
          </Box>
          <Image src={_isMobile ? TCDWorkSrcVert : TCDWorkSrc} my={4} />
        </Flex>
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
                isMobile={_isMobile}
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
                  background: '#ffffff',
                }}
                mt={['30px', 0]}
              >
                <Box ml={4} mt={['-20px', 'auto']}>
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
