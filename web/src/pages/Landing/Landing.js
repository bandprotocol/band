import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import LandingShowcase from 'components/LandingShowcase'
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

import HeroSrc from 'images/hero.png'
import BandInTheMiddle from 'images/band-overview.png'
import Sequoia from 'images/sequoia.svg'
import Dunamu from 'images/dunamu.svg'
import Seax from 'images/seax.png'
import Reddit from 'images/reddit.svg'
import Telegram from 'images/telegram.svg'
import Medium from 'images/medium.svg'
import Twitter from 'images/twitter.svg'
import Github from 'images/githubWhite.svg'
import AppCHT from 'images/appCoinhatcher.png'
import AppDS from 'images/appDataSource.png'
import LandingBandDB from 'images/landing-band-database.png'
import LandingDataGov from 'images/landing-data-governance.png'

import SSExample1 from 'images/chtssLeft.png'
import SSExample2 from 'images/chtssMid.png'
import SSExample3 from 'images/chtssRight.png'

import SSExample4 from 'images/dsssLeft.png'
import SSExample5 from 'images/dsssMid.png'
import SSExample6 from 'images/dsssRight.png'

const FilledButton = styled(Button)`
  font-family: Avenir;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  width: 196px;
  height: 46px;
  border-radius: 2px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.15);
  background-color: #4a4a4a;
  cursor: pointer;

  transition: all 0.2s;

  &:hover {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }
`

const OutlineButton = styled(Button)`
  font-family: Avenir;
  color: #4a4a4a;
  font-size: 16px;
  font-weight: 500;
  background-color: white;
  width: ${props => (props.isMobile ? '196px' : '182px')};
  height: 46px;
  border-radius: 2px;
  cursor: pointer;

  transition: all 0.2s;

  &:hover {
    background-color: #6b7df5;
  }

  &:active {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }
`

export default () => {
  const exRef = useRef(null)
  const _isMobile = isMobile()
  return (
    <Box
      style={{
        background: '#f0f0f0',
        color: '#323232',
        overflow: 'hidden',
      }}
      mt="-80px"
    >
      {/* Section 1 */}
      <Box
        pt="60px"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #5a7ffd, #495fd6)',
        }}
      >
        <PageContainer>
          <Flex
            pt={['50px', '300px']}
            pb={['50px', '60px']}
            flexDirection={['column', 'row']}
          >
            {_isMobile && (
              <Flex
                flex={1}
                style={{ minWidth: 'calc(100vw - 40px)' }}
                justifyContent="flex-end"
                alignItems="center"
              >
                <Image src={HeroSrc} />
              </Flex>
            )}
            <Box flex={1}>
              <Text
                lineHeight={1.6}
                fletterSpacing="1px"
                fontWeight={600}
                fontSize={['32px', '40px']}
                color="white"
                textAlign={['center', 'left']}
                mt={['30px', '0px']}
              >
                Data Governance Framework
                <br />
                for Web 3.0 Applications
              </Text>
              <Flex mt="25px" style={{ maxWidth: ['320px', '390px'] }}>
                <Text
                  color="white"
                  fontSize={['20px', '24px']}
                  lineHeight={1.54}
                  fontWeight={300}
                  textAlign={['center', 'left']}
                >
                  Band Protocol connects smart contracts with trusted off-chain
                  information,
                  <br />
                  provided through community-curated data providers.
                </Text>
              </Flex>
              <Flex
                mt={['40px', '50px']}
                alignItems={['center', 'flex-start']}
                flexDirection={['column', 'row']}
              >
                <AbsoluteLink href="https://developer.bandprotocol.com/">
                  <FilledButton isMobile={_isMobile}>
                    Developer Doc
                  </FilledButton>
                </AbsoluteLink>
                <Flex mx={['0px', '10px']} my={['10px', '0px']} />
                <AbsoluteLink href="/whitepaper-3.0.0.pdf">
                  <OutlineButton isMobile={_isMobile}>
                    Whitepaper v3.1
                  </OutlineButton>
                </AbsoluteLink>
              </Flex>
              {/* Join us */}
              <Flex
                mr="60px"
                mt="50px"
                width={1}
                flexDirection={['column', 'row']}
                alignItems="center"
              >
                <Box
                  width="67px"
                  bg="white"
                  mr="15px"
                  style={{ height: '1px' }}
                />
                <Text
                  fontSize="18px"
                  fontWeight={500}
                  color="white"
                  mr={['0px', '30px']}
                  mb={['20px', '0px']}
                  mt={['30px', '0px']}
                  textAlign={['center', 'left']}
                >
                  Join us {!_isMobile && ':'}
                </Text>
                <Flex
                  flex={1}
                  justifyContent={['center', 'left']}
                  alignItems="center"
                >
                  <AbsoluteLink href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ">
                    <Flex
                      mr="20px"
                      alignItems="center"
                      color="white"
                      css={{
                        '&:hover': {
                          filter:
                            'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                        },
                      }}
                    >
                      <Image src={Telegram} width="20px" />
                    </Flex>
                  </AbsoluteLink>
                  <AbsoluteLink href="https://medium.com/bandprotocol">
                    <Flex
                      mr="20px"
                      alignItems="center"
                      color="white"
                      css={{
                        '&:hover': {
                          filter:
                            'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                        },
                      }}
                    >
                      <Image src={Medium} width="20px" />
                    </Flex>
                  </AbsoluteLink>
                  <AbsoluteLink href="https://twitter.com/bandprotocol">
                    <Flex
                      mr="20px"
                      alignItems="center"
                      color="white"
                      css={{
                        '&:hover': {
                          filter:
                            'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                        },
                      }}
                    >
                      <Image src={Twitter} width="20px" />
                    </Flex>
                  </AbsoluteLink>
                  <AbsoluteLink href="https://www.reddit.com/r/bandprotocol">
                    <Flex
                      mr="20px"
                      alignItems="center"
                      color="white"
                      css={{
                        '&:hover': {
                          filter:
                            'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                        },
                      }}
                    >
                      <Image src={Reddit} width="20px" />
                    </Flex>
                  </AbsoluteLink>
                  <AbsoluteLink href="https://github.com/bandprotocol">
                    <Flex
                      mr="20px"
                      alignItems="center"
                      color="white"
                      css={{
                        '&:hover': {
                          filter:
                            'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                        },
                      }}
                    >
                      <Image src={Github} width="20px" />
                    </Flex>
                  </AbsoluteLink>
                </Flex>
              </Flex>
            </Box>
            {/* {!_isMobile && (
              <Flex flex={1} justifyContent="flex-end" alignItems="center">
                <Image src={HeroSrc} width="50vw" />
              </Flex>
            )} */}
          </Flex>
        </PageContainer>
      </Box>

      {/* Testnet live bar */}
      <Flex
        bg="#e0e0e0"
        justifyContent="center"
        mx={['calc(50vw - 400px)', 'calc(480px - 50vw)']}
        alignItems="center"
        style={{ height: '50px' }}
      >
        Kovan Testnet is LIVE! Check out the new Data Governance Portal and
        Developer Doc.
      </Flex>

      {/* Section 2: Connecting to ... */}
      <Box bg="white">
        <PageContainer>
          <Flex pt={['20px', '180px']} pb="300px">
            <Flex flexDirection="column" pr="74px">
              <Box width="253px" bg="#f2f2f2" style={{ height: '243px' }} />
              <Text
                color="#323232"
                fontSize="24px"
                fontWeight="bold"
                mt="35px"
                mb="10px"
              >
                Connect to Real-World Information
              </Text>
              <Text>
                Without access to external data, the use cases for dApps are
                limited. Prediction markets are too illiquid to be practical.
                Band Protocol provides community-curated on-chain data feeds,
                backed by strong economic incentives which ensure the data stays
                accurate.
              </Text>
              <Flex mt="36px">
                {/* TODO: add link */}
                <Text color="#323232">Explore Data</Text>
                <Text color="#323232" ml="74px">
                  How it works
                </Text>
              </Flex>
            </Flex>
            <Flex flexDirection="column">
              <Box width="253px" bg="#f2f2f2" style={{ height: '243px' }} />
              <Text
                color="#323232"
                fontSize="24px"
                fontWeight="bold"
                mt="35px"
                mb="10px"
              >
                Connect to Real-World Information
              </Text>
              <Text>
                Band Protocol provides an infrastucture for blockchain
                applications to connect with any open API without relying on a
                centralized party. This allows dApps to leverage existing data
                on the internet without compromising security, bridging the use
                cases between Web 2.0 and 3.0.
              </Text>
              <Flex mt="36px">
                {/* TODO: add link */}
                <Text color="#323232">Explore Data</Text>
                <Text color="#323232" ml="74px">
                  How it works
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Back holders */}
          {/* <Flex
            mx={['-20px', 'calc(50vw - 400px)', 'calc(480px - 50vw)']}
            bg="#252a48"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            py={['30px', '50px']}
            mb={['30px', '70px']}
          >
            <Text fontSize={['20px', '20px']} fontWeight={600} color="#8d94bf">
              Backed by
            </Text>
            <Flex
              mt={['30px', '30px']}
              alignItems="center"
              flexDirection={['column', 'row']}
              style={{ width: 'calc(100vw - 40px)', maxWidth: '800px' }}
            >
              <Flex
                flex={1}
                justifyContent="center"
                css={{
                  '&:hover': {
                    filter:
                      'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="https://www.sequoiacap.com/">
                  <Image src={Sequoia} height="20px" />
                </AbsoluteLink>
              </Flex>
              <Flex
                flex={1}
                justifyContent="center"
                my={['20px', '0px']}
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="http://www.dunamupartners.com/">
                  <Image src={Dunamu} height="20px" />
                </AbsoluteLink>
              </Flex>
              <Flex
                flex={1}
                justifyContent="center"
                css={{
                  '&:hover': {
                    filter:
                      'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="https://www.linkedin.com/company/seax-ventures/">
                  <Image src={Seax} width="105px" />
                </AbsoluteLink>
              </Flex>
            </Flex>
          </Flex> */}
        </PageContainer>
      </Box>

      {/* Section 3: The floating card */}
      <Flex
        bg="#d8d8d8"
        mx="10%"
        mt="-120px"
        py="40px"
        px={['20px', '80px']}
        justifyContent="space-between"
        style={{
          width: ['calc(100vw - 40px)', '729px'],
          height: ['290px', '370px'],
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: '10px',
        }}
      >
        {/* Left */}
        <Flex
          style={{ maxWidth: '550px' }}
          my={['20px', '0px']}
          flexDirection="column"
        >
          <Text fontSize="24px" fontWeight="bold">
            Bring Blockchain Closer to Mass Adoption
          </Text>
          <Text
            fontSize={['14px', '20px']}
            fontWeight={300}
            lineHeight={1.65}
            mt="15px"
          >
            Band is a protocol for managing and governing data in the Web3
            technology stack. DApps consume data via BAND public smart contract
            datasets rather than through external oracles.
          </Text>
          <Flex flexDirection="column">
            <Flex alignItems="center" mt={['10px', '60px']}>
              <Box
                width="67px"
                bg="#232323"
                mr="15px"
                style={{ height: '2px' }}
              />
              <Text
                fontSize="18px"
                fontWeight="bold"
                color="#4a4a4a"
                mr={['0px', '30px']}
                mb={['20px', '0px']}
                mt={['30px', '0px']}
                textAlign={['center', 'left']}
              >
                What Band solves :
              </Text>
            </Flex>
            <Flex mt="30px" justifyContent="space-between">
              {/* Sub-Column left */}
              <Flex flexDirection="column">
                <Flex alignItems="center">
                  <Box
                    width="40px"
                    bg="#4a4a4a"
                    style={{ height: '40px', borderRadius: '50%' }}
                  />
                  <Text ml="10px" fontSize="16px" color="#4a4a4a">
                    Data Availability
                  </Text>
                </Flex>
                <Flex alignItems="center" mt="5px">
                  <Box
                    width="40px"
                    bg="#4a4a4a"
                    style={{ height: '40px', borderRadius: '50%' }}
                  />
                  <Text ml="10px" fontSize="16px" color="#4a4a4a">
                    Aligned Economic Incentives
                  </Text>
                </Flex>
              </Flex>
              {/* Sub-Column right */}
              <Flex flexDirection="column">
                <Flex alignItems="center">
                  <Box
                    width="40px"
                    bg="#4a4a4a"
                    style={{ height: '40px', borderRadius: '50%' }}
                  />
                  <Text ml="10px" fontSize="16px" color="#4a4a4a">
                    Data Reliability
                  </Text>
                </Flex>
                <Flex alignItems="center" mt="5px">
                  <Box
                    width="40px"
                    bg="#4a4a4a"
                    style={{ height: '40px', borderRadius: '50%' }}
                  />
                  <Text ml="10px" fontSize="16px" color="#4a4a4a">
                    Decentralizing Trust Point
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {/* Right */}
        <Box width="293px" bg="#f2f2f2" style={{ height: '295px' }} />
      </Flex>

      {/* Section 4 */}
      <Box bg="#f0f0f0">
        <PageContainer>
          {/* Part 1: Band Feeds Data On-Chain Right When You Need */}
          <Flex pt={['20px', '100px']} justifyContent="space-between">
            <Flex flexDirection="column" pr="74px" justifyContent="center">
              <Text fontSize="18px" fontWeight="300" color="#6b6b6b">
                Data Availability
              </Text>
              <Text
                color="#323232"
                fontSize="36px"
                fontWeight="bold"
                mb="10px"
                mt="10px"
                style={{ lineHeight: '1.38' }}
              >
                Band Feeds Data On-Chain
                <br />
                Right When You Need
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '460px' }}
              >
                For high-demand data such as ETH/USD price, the data are updated
                and kept on-chain on a regular basis. DApps can request and use
                the data with just one simple function call.
              </Text>
              <Flex mt="36px">
                {/* TODO: add link */}
                <Text color="#323232" fontWeight="bold">
                  Explore Datasets Available
                </Text>
              </Flex>
            </Flex>
            <Box width="420px" bg="white" style={{ height: '420px' }} />
          </Flex>

          {/* Part 2: Band Aggregates Data from Multiple Providers */}
          <Flex pt={['20px', '100px']} justifyContent="space-between">
            <Box width="410px" bg="white" style={{ height: '420px' }} />
            <Flex flexDirection="column" pl="74px" justifyContent="center">
              <Text fontSize="18px" fontWeight="300" color="#6b6b6b">
                Data Reliability
              </Text>
              <Text
                color="#323232"
                fontSize="36px"
                fontWeight="bold"
                mb="10px"
                mt="10px"
                style={{ lineHeight: '1.38' }}
              >
                Band Aggregates Data
                <br />
                from Multiple Providers
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '460px' }}
              >
                Band enforces strict requirements before serving each query.
                Each data point requires more than ⅔ of qualified providers to
                serve the data, which guarantees high tolerance for collusion.
              </Text>
              <Flex mt="36px">
                {/* TODO: add link */}
                <Text color="#323232" fontWeight="bold">
                  Learn How Data Curation Works
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Part 3: Dataset Tokens on Bonding Curves */}
          <Flex pt={['20px', '100px']} justifyContent="space-between">
            <Flex flexDirection="column" pr="74px" justifyContent="center">
              <Text fontSize="18px" fontWeight="300" color="#6b6b6b">
                Aligned Economic Incentives
              </Text>
              <Text
                color="#323232"
                fontSize="36px"
                fontWeight="bold"
                mb="10px"
                mt="10px"
                style={{ lineHeight: '1.38' }}
              >
                Dataset Tokens on
                <br />
                Bonding Curves
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '460px' }}
              >
                Each dataset has its own token for governing how the dataset
                functions. It incentivizes token holders and data providers to
                curate high-quality data, which in-turn drives greater security
                for dApps.
              </Text>
              <Flex mt="36px">
                {/* TODO: add link */}
                <Text color="#323232" fontWeight="bold">
                  Learn How Dual-Token Economics Works
                </Text>
              </Flex>
            </Flex>
            <Box width="410px" bg="white" style={{ height: '420px' }} />
          </Flex>

          {/* Part 4: Community Runs Datasets and Grows Together */}
          <Flex
            pt={['20px', '100px']}
            justifyContent="space-between"
            pb="100px"
          >
            <Box width="410px" bg="white" style={{ height: '420px' }} />
            <Flex flexDirection="column" pl="74px" justifyContent="center">
              <Text fontSize="18px" fontWeight="300" color="#6b6b6b">
                Decentralizing Trust Point
              </Text>
              <Text
                color="#323232"
                fontSize="36px"
                fontWeight="bold"
                mb="10px"
                mt="10px"
                style={{ lineHeight: '1.38' }}
              >
                Community Runs
                <br />
                Datasets and Grows Together
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '460px' }}
              >
                Band provides a decentralized, unstoppable platform for
                community to curate reliable data. No single identity has
                authority to bypass governance and take control of the data.
              </Text>
              <Flex mt="36px">
                {/* TODO: add link */}
                <Text color="#323232" fontWeight="bold">
                  Learn How to Participate in Curation
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Explore more feature button */}
          <Flex justifyContent="center" maxWidth="500px">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              bg="#4a4a4a"
              p="16px 15px"
              width="100%"
              style={{ maxWidth: '500px', borderRadius: '4px' }}
            >
              <Text color="white" fontSize="16px">
                Explore Band Protocol Features
              </Text>
              {/* TODO: change it into actual symbol */}
              <Text color="white" fontSize="16px">
                ->
              </Text>
            </Flex>
          </Flex>

          {/* Stay update */}
          <Flex
            bg="#d8d8d8"
            mt="90px"
            mb="60px"
            flexDirection="column"
            alignItems="center"
            py="70px"
          >
            <Text
              textAlign="center"
              style={{ maxWidth: '500px', lineHeight: '1.71' }}
            >
              Stay up to date on the latest news about how Band Protocol brings
              more use cases to smart contracts
            </Text>
            <Text textAlign="center" mt="20px">
              **** ADD SUBSCRIBE ****
            </Text>
          </Flex>
        </PageContainer>
      </Box>

      {/* <LandingShowcase
        background="#21253f"
        title="Community Curated Data Feed for DApps"
        description={`is designed as a community governed and managed price
          feed for decentralized applications. New possibilities will be opened for decentralized applications that rely on external real-world information such as price feed`}
        link1="data.bandprotocol.com"
        link2="Token-Curated DataSources"
        Logo={AppDS}
        logoHeight={['80px', '125px']}
        Img1={SSExample4}
        Img2={SSExample5}
        Img3={SSExample6}
      >
        <Text
          ref={exRef}
          textAlign={['center', 'center']}
          fontWeight="600"
          fontSize={['24px', '32px']}
          lineHeight={[1.6, 1]}
        >
          Applications Developed {_isMobile && <br />} with Band Protocol
        </Text>
      </LandingShowcase>
      <LandingShowcase
        background="#242944"
        title="The Bloomberg of Crypto"
        description={`Coinhatcher is decentralized crypto insight portal.
         Building on top of token-curated registry, its purpose is to curate
          trusted and reliable information for the blockchain industry including
           daily news, general market data, and crypto project information`}
        link1="CoinHatcher.com"
        link2="Token-Curated Registry"
        Logo={AppCHT}
        logoHeight={['120px', '160px']}
        Img1={SSExample1}
        Img2={SSExample2}
        Img3={SSExample3}
      />
      <Box py={5} style={{ background: '#17192e' }}>
        <StartBuilding />
      </Box> */}
    </Box>
  )
}
