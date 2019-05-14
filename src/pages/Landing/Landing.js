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
  background-color: #6b7df5;
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
  color: #f7f8ff;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0);
  width: ${props => (props.isMobile ? '196px' : '182px')};
  height: 46px;
  border-radius: 2px;
  border: solid 1px ${props => props.borderColor};
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
        background: colors.gradient.dark,
        color: colors.gradient.dark,
        overflow: 'hidden',
      }}
      mt="-80px"
    >
      <Box
        style={{ background: colors.gradient.dark }}
        pt="60px"
        pb={['0px', '100px']}
      >
        <PageContainer>
          <Flex
            pt={['50px', '100px']}
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
                Decentralized
                <br />
                Data Governance
              </Text>
              <Flex mt="25px" style={{ maxWidth: ['320px', '390px'] }}>
                <Text
                  color="#f7f8ff"
                  fontSize={['20px', '24px']}
                  lineHeight={1.54}
                  fontWeight={300}
                  textAlign={['center', 'left']}
                >
                  An open standard for decentralized management of data in Web3
                  stack
                </Text>
              </Flex>
              <Flex
                mt={['40px', '24px']}
                alignItems={['center', 'flex-start']}
                flexDirection={['column', 'row']}
              >
                <AbsoluteLink href="https://developer.bandprotocol.com/">
                  <FilledButton isMobile={_isMobile}>
                    Start Building
                  </FilledButton>
                </AbsoluteLink>
                <Flex mx={['0px', '10px']} my={['10px', '0px']} />
                <Link to="why-band">
                  <OutlineButton isMobile={_isMobile} borderColor="#6b7df5">
                    Learn More
                  </OutlineButton>
                </Link>
              </Flex>
              <Flex
                mr="60px"
                mt="30px"
                width={1}
                flexDirection={['column', 'row']}
              >
                <Text
                  fontSize="18px"
                  fontWeight={500}
                  color="#8d94bf"
                  mr={['0px', '30px']}
                  mb={['20px', '0px']}
                  mt={['30px', '0px']}
                  textAlign={['center', 'left']}
                >
                  Join Our Community {!_isMobile && ':'}
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
            {!_isMobile && (
              <Flex flex={1} justifyContent="flex-end" alignItems="center">
                <Image src={HeroSrc} width="50vw" />
              </Flex>
            )}
          </Flex>
          <Flex
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
          </Flex>
          <Flex
            bg="#36406e"
            py="40px"
            px={['20px', '0px']}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            style={{
              width: ['calc(100vw - 40px)', '729px'],
              height: ['290px', '370px'],
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: '10px',
              color: 'white',
            }}
          >
            <Image src={BandInTheMiddle} width={['auto', '729px']} />
            <Flex style={{ maxWidth: '650px' }} my={['20px', '0px']}>
              <Text
                textAlign="center"
                fontSize={['14px', '20px']}
                fontWeight={300}
                lineHeight={1.65}
              >
                Band is a protocol for managing and governing data in the Web3
                technology stack. DApps consume data via BAND public smart
                contract datasets rather than through external oracles.
              </Text>
            </Flex>
            <Flex
              alignItems="center"
              mt={['20px', '35px']}
              onClick={() => window.scrollTo(0, exRef.current.offsetTop)}
              style={{ cursor: 'pointer' }}
            >
              <Text
                fontWeight={400}
                fontSize={['16px', '20px']}
                lineHeight={1.45}
                mr={[2, 3]}
                css={{
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    color: '#bfcdff',
                  },
                }}
              >
                Example Use Cases
              </Text>
              <Text color="#5eebbe" fontSize={['16px', '18px']}>
                <i className="fas fa-arrow-down" />
              </Text>
            </Flex>
          </Flex>
          <Box pt={['40px', 6]} pb={[4, 5]}>
            <Text
              textAlign={['center', 'center']}
              fontWeight={900}
              fontSize={['24px', '34px']}
              letterSpacing="1.3px"
              lineHeight={[1.33, 1]}
              mb={3}
              mt={['30px', '0px']}
              color="white"
            >
              Band Protocol Provides
            </Text>
            <Text
              color="#f7f8ff"
              fontWeight={400}
              textAlign={['center', 'center']}
              fontSize={['16px', '25px']}
              lineHeight={[1.63, 1.16]}
              mb={[4, 0]}
            >
              Reliable Datasets for Enterprises, {_isMobile && <br />}Developers
              and Communities
            </Text>
          </Box>
          <Flex
            pb={5}
            flexDirection={['column', 'row']}
            justifyContent="center"
          >
            <FeatureCard
              isMobile={_isMobile}
              subtitle="Develop using"
              title="Band Datasets"
              content="Take advantage of Token-Curated DataSources as a trusted source of crypto price, sport and loterry."
              linkText="Integrate Data with your DApps"
              link="https://data.bandprotocol.com/"
              mr="36px"
            >
              <Flex
                style={{ maxHeight: '100px' }}
                my="auto"
                pl={['20px', '20px']}
              >
                <Image src={LandingBandDB} height="80px" />
              </Flex>
            </FeatureCard>
            <FeatureCard
              isMobile={_isMobile}
              mt={_isMobile ? '20px' : '0px'}
              subtitle="Participate in"
              title="Data Governance"
              content="Stake on data providers you trust and earn provider fee."
              linkText="Governance Portal"
              link="https://app.bandprotocol.com/"
            >
              <Flex
                style={{ maxHeight: '100px' }}
                my="auto"
                pl={['20px', '20px']}
              >
                <Image src={LandingDataGov} height="80px" />
              </Flex>
            </FeatureCard>
          </Flex>
        </PageContainer>
      </Box>
      <LandingShowcase
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
      </Box>
    </Box>
  )
}
