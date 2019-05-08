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
import media, { isMobile } from 'ui/media'

import FeatureCard from 'components/FeatureCard'
import StartBuilding from 'components/StartBuilding'

import CompanySrc from 'images/company.png'
import TCDWorkSrc from 'images/tcd-work.svg'
import TCDPriceFeed from 'images/tcd-price-feed.png'
import TCDCrossChain from 'images/tcd-cross-chain.png'

import CoinDeskSrc from 'images/featured/coindesk.png'
import YahooNewsSrc from 'images/featured/yahoo-news.png'
import TechInAsiaSrc from 'images/featured/tech-in-asia.png'
import E27Src from 'images/featured/e27.png'
import DealSrc from 'images/featured/deal.png'
import BTSrc from 'images/featured/bt.png'
import JumpstartSrc from 'images/featured/jumpstart.png'

const Featured = styled.a.attrs({
  target: '_blank',
})`
  padding: 0 10px 30px;
  display: block;
  transition: all 250ms;

  ${media.mobile} {
  }

  &:hover {
    transform: translateY(-5px);
  }
`

export default class LandingPage extends React.Component {
  render() {
    return (
      <Box>
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" mb={4}>
            <Box mt={5} mb={2}>
              <H1 textAlign="center" dark>
                Company
              </H1>
            </Box>
            <Text
              textAlign="center"
              width="780px"
              fontSize={2}
              lineHeight={1.94}
            >
              Band Protocol is a protocol for decentralized data governance. We
              provide open-source standard and framework for the decentralized
              management of data.
            </Text>
            <Image src={CompanySrc} my={5} />
            <Card bg="#f6f8ff" pt={4} pb={5} px="42px" width="840px">
              <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
                Band Protocol was created to solve the issues plaguing current
                data infrastructures and decentralized technologies as a whole.
                It is estimated that over 1.2 million terabytes of data is
                stored on the web and currently much of this is unstructured
                data or unreliable data.
                <br />
                <br />
                Band Protocol is a component layer solution for managing data in
                the Web3 technology stack. With the use of an innovative token
                framework and standardized data protocols, Band is able to
                create a community-driven data curation ecosystem that is
                secure, reliable and accessible.
                <br />
                <br />
                Through the use of a standard framework, Band is able to provide
                a socially scalable method for widespread adoption and
                integration of trusted data that all dApps can utilize.
              </Text>
            </Card>
          </Flex>
          <Flex
            flexDirection="column"
            alignItems="center"
            pb={5}
            pt={5}
            mt={5}
            mx="-40px"
            style={{ borderTop: 'solid 1px #e2e2e2' }}
          >
            <Box mb={3}>
              <H1 textAlign="center" dark>
                Featured In
              </H1>
            </Box>
            <Flex
              alignItems="center"
              flexWrap="wrap"
              justifyContent="center"
              mb={5}
            >
              <Featured href="https://www.coindesk.com/sequoia-india-leads-3-million-round-for-token-startup-tackling-fake-news">
                <img height="32px" src={CoinDeskSrc} />
              </Featured>
              <Featured href="https://sg.news.yahoo.com/blockchain-based-information-curation-startup-band-protocol-secures-010013124.html">
                <img height="40px" src={YahooNewsSrc} />
              </Featured>
              <Featured href="https://www.techinasia.com/band-protocol-nets-3m-seed-funding-sequoia-india">
                <img height="33px" src={TechInAsiaSrc} />
              </Featured>
              <Featured href="https://e27.co/blockchain-based-information-curation-startup-band-protocol-secures-us3m-seed-funding-20190217/">
                <img height="48" src={E27Src} />
              </Featured>
              <Featured href="https://www.dealstreetasia.com/stories/sequoia-india-band-protocol-121721/">
                <img height="65" src={DealSrc} />
              </Featured>
              <Featured href="https://www.businesstimes.com.sg/garage/blockchain-startup-band-protocol-raises-us3m-seed-round-led-by-sequoia-india">
                <img height="55" src={BTSrc} />
              </Featured>
              <Featured href="https://jumpstartmag.com/blog/band-protocol-raises-us3-million-seed-funding-led-by-sequoia-india-to-give-power-back-to-internet">
                <img height="42" src={JumpstartSrc} />
              </Featured>
            </Flex>
          </Flex>
        </PageContainer>
        <Box bg="#f6f8ff">
          <PageContainer />
        </Box>
        <Box bg="#ffffff" style={{ height: 180 }} />
        <Box mb="-80px" style={{ background: '#17192e', color: '#ffffff' }}>
          <StartBuilding style={{ transform: 'translateY(-50%)' }} />
        </Box>
      </Box>
    )
  }
}
