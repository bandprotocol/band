import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import LandingShowcase from 'components/LandingShowcase'
import LinkWithArrow from 'components/LinkWithArrow'
import Subscribe from 'components/Subscribe'
import {
  Flex,
  Text,
  Highlight,
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
import FilledButton from 'components/FilledButton'

import FeatureCard from 'components/FeatureCard'
import StartBuilding from 'components/StartBuilding'

import LandingHero from 'images/landing-hero-background.svg'
import LandingRealworld from 'images/landing-connect-realworld.svg'
import LandingOpenAPI from 'images/landing-connect-openapi.svg'
import LandingMassAdoption from 'images/landing-massadoption.svg'
import LandingFeature from 'images/landing-features.png'

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

const OutlineButton = styled(Button)`
  font-family: Avenir;
  color: #122069;
  font-size: 16px;
  font-weight: 600;
  background-color: white;
  width: ${props => (props.isMobile ? '196px' : '182px')};
  height: 46px;
  border-radius: 2px;
  cursor: pointer;
  font-family: bio-sans;

  transition: all 0.2s;

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
        <Box
          style={{
            backgroundImage: `url(${LandingHero})`,
            backgroundPosition: 'bottom',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <PageContainer>
            <Flex
              pt={['50px', '150px']}
              pb={['50px', '140px']}
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
                  fontSize={['32px', '56px']}
                  color="white"
                  textAlign={['center', 'left']}
                  mt={['30px', '0px']}
                  fontFamily="bio-sans"
                >
                  Data Governance Framework
                  <br />
                  for Web 3.0 Applications
                </Text>
                <Flex mt="25px" style={{ maxWidth: ['320px', '390px'] }}>
                  <Text
                    color="white"
                    fontSize={['20px', '22px']}
                    lineHeight={1.54}
                    fontWeight={300}
                    textAlign={['center', 'left']}
                  >
                    Band Protocol connects smart contracts with trusted
                    off-chain
                    <br />
                    information, provided through community-curated data
                    providers.
                  </Text>
                </Flex>
                <Flex
                  mt={['40px', '50px']}
                  alignItems={['center', 'flex-start']}
                  flexDirection={['column', 'row']}
                >
                  <AbsoluteLink href="https://developer.bandprotocol.com/">
                    <FilledButton message="Developer Documentation" />
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
                    mx="15px"
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
                    fontFamily="bio-sans"
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
      </Box>

      {/* Testnet live bar */}
      <Flex
        bg="#dce1ff"
        justifyContent="center"
        mx={['calc(50vw - 400px)', 'calc(480px - 50vw)']}
        alignItems="center"
        color="#404fac"
        fontWeight="900"
        style={{ height: '65px', fontFamily: 'bio-sans' }}
      >
        Kovan Testnet is LIVE! Check out the
        <Text color="#5569de" mx="5px">
          new Data Governance Portal
        </Text>
        and
        <Text color="#5569de" mx="5px">
          Developer Doc.
        </Text>
      </Flex>

      {/* Section 2: Connecting to ... */}
      <Box
        style={{
          backgroundImage: 'linear-gradient(to bottom, #ffffff, #d8dfff)',
        }}
      >
        <PageContainer>
          <Flex pt={['20px', '100px']} pb="150px">
            {/* Connect to Real-World Information */}
            <Flex
              flexDirection="column"
              alignItems="flex-start"
              pr="74px"
              mt="50px"
            >
              <Image src={LandingRealworld} />
              <Flex
                flexDirection="row"
                alignItems="center"
                fontSize="24px"
                mt="35px"
                mb="10px"
                style={{
                  lineHeight: '2.25',
                  fontWeight: 'bold',
                  fontFamily: 'bio-sans',
                }}
              >
                <Text color="#323232">Connect to</Text>
                <Text color="#5569de" ml="5px">
                  Real-World Information
                </Text>
              </Flex>

              <Text
                fontSize="16px"
                fontWeight="300"
                style={{ lineHeight: '2' }}
              >
                Without access to external data, the use cases for dApps are
                limited. Prediction markets are too illiquid to be practical.
                Band Protocol provides community-curated on-chain data feeds,
                backed by strong economic incentives which ensure the data stays
                accurate.
              </Text>
              <Flex
                mt="15px"
                style={{ fontFamily: 'bio-sans', fontWeight: 'bold' }}
              >
                <LinkWithArrow text="Explore Data" />
                <LinkWithArrow text="How it works" ml="76px" />
              </Flex>
            </Flex>

            {/* Separator line */}
            <Box
              width="1px"
              bg="#c8d2ff"
              style={{ height: '300px' }}
              mx="55px"
            />

            {/* Connect to Any Open API */}
            <Flex flexDirection="column" alignItems="flex-start" pr="74px">
              <Image src={LandingOpenAPI} />
              <Flex
                flexDirection="row"
                alignItems="center"
                fontSize="24px"
                mt="35px"
                mb="10px"
                style={{
                  lineHeight: '2.25',
                  fontWeight: 'bold',
                  fontFamily: 'bio-sans',
                }}
              >
                <Text color="#323232">Connect to</Text>
                <Text color="#5569de" ml="5px">
                  Any Open API
                </Text>
              </Flex>
              <Text
                fontSize="16px"
                fontWeight="300"
                style={{ lineHeight: '2' }}
              >
                Band Protocol provides an infrastucture for blockchain
                applications to connect with any open API without relying on a
                centralized party. This allows dApps to leverage existing data
                on the internet without compromising security, bridging the use
                cases between Web 2.0 and 3.0.
              </Text>
              <Flex
                mt="15px"
                style={{ fontFamily: 'bio-sans', fontWeight: 'bold' }}
              >
                <LinkWithArrow text="Explore Endpoints" />
                <LinkWithArrow text="Learn more" ml="76px" />
              </Flex>
            </Flex>
          </Flex>
        </PageContainer>

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

        {/* Section 3: The floating card */}
        <Flex
          mb="20px"
          mt="-120px"
          py="40px"
          px={['20px', '80px']}
          justifyContent="space-between"
          style={{
            // width: ['calc(100vw - 40px)', '1200px'],
            maxWidth: '1400px',
            height: ['290px', '370px'],
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '10px',
            boxShadow: '0 2px 20px 0 #d3dbff',
            backgroundColor: '#ffffff',
            margin: '0 auto',
          }}
        >
          {/* Left */}
          <Flex
            style={{ maxWidth: '700px' }}
            my={['20px', '0px']}
            flexDirection="column"
          >
            <Text
              fontSize="36px"
              fontWeight="bold"
              color="#3b426b"
              style={{ fontFamily: 'bio-sans' }}
            >
              Bring Blockchain Closer to Mass Adoption
            </Text>
            <Text
              fontSize={['14px', '14px']}
              fontWeight={300}
              lineHeight={2}
              mt="25px"
            >
              Data availability and reliability in decentralized platforms has
              restricted adoption since the inception of smart contracts. Band
              Protocol provides a standard framework for the decentralized
              management of data, serving as a fundamental query layer for
              applications that requires access to off-chain information. This
              eliminates the critical centralizing trust and points of failure
              that the oracle problem typically introduces to decentralized
              applications with other designs.
            </Text>
            <Flex flexDirection="column">
              <Flex alignItems="center" mt={['10px', '60px']}>
                <Box
                  width="67px"
                  bg="#232323"
                  mr="15px"
                  style={{ height: '2px' }}
                />
                <Flex alignItems="center">
                  <Text
                    fontSize="18px"
                    fontWeight="bold"
                    color="#4a4a4a"
                    mb={['20px', '0px']}
                    mt={['30px', '0px']}
                    textAlign={['center', 'left']}
                    style={{ fontFamily: 'bio-sans' }}
                  >
                    What
                  </Text>
                  <Text
                    fontSize="18px"
                    fontWeight="bold"
                    mx="5px"
                    color="#5569de"
                    style={{ fontFamily: 'bio-sans' }}
                  >
                    Band solves
                  </Text>
                  <Text
                    fontSize="18px"
                    fontWeight="bold"
                    color="#4a4a4a"
                    style={{ fontFamily: 'bio-sans' }}
                  >
                    :
                  </Text>
                </Flex>
              </Flex>
              <Flex
                mt="30px"
                justifyContent="space-between"
                style={{ maxWidth: '650px' }}
              >
                {/* Sub-Column left */}
                <Flex flexDirection="column">
                  <Flex alignItems="center">
                    <Box
                      width="40px"
                      bg="#3b426b"
                      style={{ height: '40px', borderRadius: '50%' }}
                    />
                    <Text ml="20px" fontSize="16px" color="#4a4a4a">
                      Data Availability
                    </Text>
                  </Flex>
                  <Flex alignItems="center" mt="15px">
                    <Box
                      width="40px"
                      bg="#3b426b"
                      style={{ height: '40px', borderRadius: '50%' }}
                    />
                    <Text ml="20px" fontSize="16px" color="#4a4a4a">
                      Aligned Economic Incentives
                    </Text>
                  </Flex>
                </Flex>
                {/* Sub-Column right */}
                <Flex flexDirection="column">
                  <Flex alignItems="center">
                    <Box
                      width="40px"
                      bg="#3b426b"
                      style={{ height: '40px', borderRadius: '50%' }}
                    />
                    <Text ml="20px" fontSize="16px" color="#4a4a4a">
                      Data Reliability
                    </Text>
                  </Flex>
                  <Flex alignItems="center" mt="15px">
                    <Box
                      width="40px"
                      bg="#3b426b"
                      style={{ height: '40px', borderRadius: '50%' }}
                    />
                    <Text ml="20px" fontSize="16px" color="#4a4a4a">
                      Decentralizing Trust Point
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {/* Right */}
          <Flex alignItems="center">
            <Box>
              <Image src={LandingMassAdoption} />
            </Box>
          </Flex>
        </Flex>

        {/* Section 4 */}
        <Box
          style={{
            margin: '100px auto 0px',
            height: '1650px',
            backgroundImage: `url(${LandingFeature})`,
            backgroundSize: '1200px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            zIndex: 0,
          }}
        >
          <PageContainer style={{ position: 'relative ' }}>
            {/* Part 1: Band Feeds Data On-Chain Right When You Need */}
            <Flex
              flexDirection="column"
              pr="74px"
              justifyContent="center"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <Text fontSize="20px" fontWeight="300" color="#546ee5">
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
              <Flex mt="20px">
                <LinkWithArrow text="Explore Datasets Available" />
              </Flex>
            </Flex>

            {/* Part 2: Band Aggregates Data from Multiple Providers */}
            <Flex
              flexDirection="column"
              justifyContent="center"
              style={{ position: 'absolute', top: '450px', right: 0 }}
            >
              <Text fontSize="20px" fontWeight="300" color="#546ee5">
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
                style={{ lineHeight: '2', maxWidth: '550px' }}
              >
                Band enforces strict requirements before serving each query.
                Each data point requires more than ⅔ of qualified providers to
                serve the data, which guarantees high tolerance for collusion.
              </Text>
              <Flex mt="20px">
                <LinkWithArrow text="Learn How Data Curation Works" />
              </Flex>
            </Flex>

            {/* Part 3: Dataset Tokens on Bonding Curves */}
            <Flex
              flexDirection="column"
              pr="74px"
              justifyContent="center"
              style={{ position: 'absolute', top: '900px', left: 0 }}
            >
              <Text fontSize="20px" fontWeight="300" color="#546ee5">
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
                style={{ lineHeight: '2', maxWidth: '550px' }}
              >
                Each dataset has its own token for governing how the dataset
                functions. It incentivizes token holders and data providers to
                curate high-quality data, which in-turn drives greater security
                for dApps.
              </Text>
              <Flex mt="20px">
                <LinkWithArrow text="Learn How Dual-Token Economics Works" />
              </Flex>
            </Flex>

            {/* Part 4: Community Runs Datasets and Grows Together */}
            <Flex
              flexDirection="column"
              pl="74px"
              justifyContent="center"
              style={{ position: 'absolute', top: '1320px', right: 0 }}
            >
              <Text fontSize="20px" fontWeight="300" color="#546ee5">
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
              <Flex mt="20px">
                <LinkWithArrow text="Learn How to Participate in Curation" />
              </Flex>
            </Flex>
          </PageContainer>
        </Box>

        <Box>
          <PageContainer>
            <Flex flexDirection="column" alignItems="center">
              {/* Explore more feature button */}
              <Flex justifyContent="center" mt="120px">
                <FilledButton
                  width="500px"
                  message="Explore Band Protocol Features"
                  arrow
                />
              </Flex>

              {/* Stay update */}
              <Flex
                mt="130px"
                bg="#0c154c"
                flexDirection="column"
                alignItems="center"
                py="50px"
                color="white"
                fontSize="20px"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: 'bio-sans',
                  width: '1000px',
                }}
              >
                <Text
                  textAlign="center"
                  style={{ maxWidth: '550px', lineHeight: '1.71' }}
                >
                  <Highlight>Stay up to date on</Highlight> the latest news{' '}
                  <Highlight>about how</Highlight> Band Protocol
                  <Highlight>brings more use cases to</Highlight> smart
                  contracts
                </Text>
                <Text textAlign="center" mt="30px">
                  <Subscribe />
                </Text>
              </Flex>
            </Flex>
          </PageContainer>
        </Box>
      </Box>

      <Box
        bg="#344498"
        width="100%"
        mt="-125px"
        style={{ height: '130px', zIndex: 0, position: 'relative' }}
      />

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
