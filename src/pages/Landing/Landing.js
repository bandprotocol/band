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
import AppCHT from 'images/appCoinhatcher.svg'
import AppDS from 'images/appDataSource.svg'
import LandingBandDB from 'images/landing-band-database.png'
import LandingDataGov from 'images/landing-data-governance.png'

import SSExample1 from 'images/chtss1@3x.png'
import SSExample2 from 'images/chtssMid.png'
import SSExample3 from 'images/chtssRight.png'

import SSExample4 from 'images/dsss1@3x.jpg'
import SSExample5 from 'images/dsss2@3x.jpg'
import SSExample6 from 'images/dsss3@3x.png'

const FilledButton = styled(Button)`
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  width: 196px;
  height: 46px;
  border-radius: 6px;
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
  color: #f7f8ff;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0);
  width: ${props => (props.isMobile ? '196px' : '182px')};
  height: 46px;
  border-radius: 6px;
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
      style={{ background: colors.gradient.dark, color: colors.gradient.dark }}
      mt="-80px"
    >
      <Box
        style={{ background: colors.gradient.dark }}
        pt="60px"
        pb={['0px', '100px']}
      >
        <PageContainer>
          <Flex py={['50px', '150px']} flexDirection={['column', 'row']}>
            {_isMobile && (
              <Flex
                flex={1}
                style={{ minWidth: 'calc(100vw - 40px)' }}
                bg="reds"
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
                ontWeight="600"
                fontSize={['24px', '40px']}
                fontFamily="Avenir-Heavy"
                color="white"
              >
                Decentralized
                <br />
                Data Governance
              </Text>
              <Flex mt="25px" style={{ maxWidth: '390px' }}>
                <Text
                  color="#f7f8ff"
                  fontSize={['16px', '24px']}
                  lineHeight={1.54}
                  fontWeight={300}
                >
                  An open standard for decentralized management of data on Web3
                  stack
                </Text>
              </Flex>
              <Flex mt="30px" flexDirection={['column-reverse', 'row']}>
                <AbsoluteLink href="https://developer.bandprotocol.com/">
                  <OutlineButton isMobile={_isMobile} borderColor="#6b7df5">
                    Learn More
                  </OutlineButton>
                </AbsoluteLink>
                <Flex mx={['0px', '10px']} my={['10px', '0px']} />
                <Link to="why-band">
                  <FilledButton isMobile={_isMobile}>
                    Start Building
                  </FilledButton>
                </Link>
              </Flex>
            </Box>
            {!_isMobile && (
              <Flex flex={1} justifyContent="flex-end" alignItems="center">
                <Image src={HeroSrc} height="340px" />
              </Flex>
            )}
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
                Band Protocol is a component layer solution for managing data in
                the Web3 technology stack. DApps consume data via BAND public
                smart contract datasets rather than through external oracles.
              </Text>
            </Flex>
            <Flex
              alignItems="center"
              mt={['20px', '35px']}
              onClick={() =>
                window.document.body.scrollTo(0, exRef.current.offsetTop - 45)
              }
              style={{ cursor: 'pointer' }}
            >
              <Text
                fontWeight={400}
                fontSize={['16px', '20px']}
                lineHeight={1.45}
                mr={[2, 3]}
                css={{
                  '&:hover': {
                    color: '#bfcdff',
                  },
                }}
              >
                Example Usecases
              </Text>
              <Text color="#5eebbe" fontSize={['16px', '18px']}>
                <i className="fas fa-arrow-right" />
              </Text>
            </Flex>
          </Flex>
          <Box pt={['40px', 6]} pb={[4, 5]}>
            <Text
              textAlign={['left', 'center']}
              fontWeight={900}
              fontSize={['24px', '34px']}
              letterSpacing="1.3px"
              lineHeight={[1.33, 1]}
              mb={3}
              color="white"
            >
              Band Protocol {_isMobile && <br />}Provides
            </Text>
            <Text
              color="#f7f8ff"
              fontWeight={400}
              textAlign={['left', 'center']}
              fontSize={['16px', '25px']}
              lineHeight={[1.63, 1.16]}
            >
              Reliable Datasets for Enterprises, {_isMobile && <br />}Developers
              and Communities
            </Text>
          </Box>
          <Flex flexDirection={['column', 'row']} justifyContent="center">
            <FeatureCard
              isMobile={_isMobile}
              subtitle="Develop using"
              title="Band Datasets"
              content="Take advantage of Token Curated DataSource as a trusted source of crypto price, sport and loterry."
              linkText="Integrate Data with your DApps"
              link="https://data.bandprotocol.com/"
              mr="36px"
            >
              <Box mt={['20px', '0px']}>
                <Image src={LandingBandDB} height="92px" />
              </Box>
            </FeatureCard>
            <FeatureCard
              isMobile={_isMobile}
              mt={_isMobile ? '20px' : '0px'}
              subtitle="Participate in"
              title="Data Governance"
              content="Stake on data providers you trust and earn provider fee."
              linkText="Governance Portal"
              link="https://app-wip.rinkeby.bandprotocol.com/"
            >
              <Box mt="33px" pl="30px">
                <Image src={LandingDataGov} width="215px" />
              </Box>
            </FeatureCard>
          </Flex>
          <Flex
            mt={['50px', '75px']}
            px={['0px', '20px']}
            flexDirection={['column', 'row']}
            justifyContent="center"
          >
            <Flex
              flex={1}
              flexDirection="column"
              pb={['40px', '0px']}
              ml={['0px', '10%']}
            >
              <Flex>
                <Text
                  fontSize={['20px', '22px']}
                  fontWeight={600}
                  color="#8d94bf"
                >
                  Partnerships Featuring
                </Text>
              </Flex>
              <Flex
                mt={['30px', '40px']}
                css={{
                  '&:hover': {
                    filter:
                      'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="https://www.sequoiacap.com/">
                  <Image src={Sequoia} width="148px" />
                </AbsoluteLink>
              </Flex>
              <Flex
                mt="35px"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="http://www.dunamupartners.com/">
                  <Image src={Dunamu} width="245px" />
                </AbsoluteLink>
              </Flex>
              <Flex
                mt="35px"
                css={{
                  '&:hover': {
                    filter:
                      'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="https://www.linkedin.com/company/seax-ventures/">
                  <Image src={Seax} width="105px" height="45px" />
                </AbsoluteLink>
              </Flex>
            </Flex>
            <Flex
              flex={1}
              pb={['40px', '0px']}
              flexDirection="column"
              ml={['0px', '10%']}
            >
              <Flex>
                <Text
                  fontSize={['20px', '22px']}
                  fontWeight={600}
                  color="#8d94bf"
                >
                  Join Band Protocol {_isMobile && <br />}Community
                </Text>
              </Flex>
              <AbsoluteLink href="https://www.reddit.com/r/bandprotocol">
                <Flex
                  fontSize="18px"
                  mt="40px"
                  alignItems="center"
                  color="white"
                  css={{
                    '&:hover': {
                      filter:
                        'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                    },
                  }}
                >
                  <Image src={Reddit} width="30px" />
                  <Flex mx="20px" />
                  Reddit
                  <Flex mx="20px" />
                </Flex>
              </AbsoluteLink>
              <AbsoluteLink href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ">
                <Flex
                  fontSize="18px"
                  mt="35px"
                  alignItems="center"
                  color="white"
                  css={{
                    '&:hover': {
                      filter:
                        'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                    },
                  }}
                >
                  <Image src={Telegram} width="30px" />
                  <Flex mx="20px" />
                  Telegram
                </Flex>
              </AbsoluteLink>
              <AbsoluteLink href="https://medium.com/bandprotocol">
                <Flex
                  fontSize="18px"
                  mt="35px"
                  alignItems="center"
                  color="white"
                  css={{
                    '&:hover': {
                      filter:
                        'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                    },
                  }}
                >
                  <Image src={Medium} width="30px" />
                  <Flex mx="20px" />
                  Medium
                </Flex>
              </AbsoluteLink>
              <AbsoluteLink href="https://twitter.com/bandprotocol">
                <Flex
                  fontSize="18px"
                  mt="35px"
                  alignItems="center"
                  color="white"
                  css={{
                    '&:hover': {
                      filter:
                        'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                    },
                  }}
                >
                  <Image src={Twitter} width="30px" />
                  <Flex mx="20px" />
                  Twitter
                </Flex>
              </AbsoluteLink>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>
      <LandingShowcase
        background="#242944"
        title="The Bloomberg of Crypto"
        description={`CoinHatcher is decentralized data curated cryptocurrency
          asset market cap, exchange data metrics, rankings & news
          platform. Its purpose is to provide trusted and reliable
          information for the blockchain industry.`}
        link1="CoinHatcher.com"
        link2="Token Curated Registries"
        Logo={AppCHT}
        Img1={SSExample1}
        Img2={SSExample2}
        Img3={SSExample3}
      >
        <Text
          ref={exRef}
          textAlign={['left', 'center']}
          fontWeight="600"
          fontSize={['24px', '32px']}
          lineHeight={[1.33, 1]}
        >
          Applications Developed {_isMobile && <br />} with Band Protocol
        </Text>
      </LandingShowcase>
      <LandingShowcase
        background="#21253f"
        title="Community Curated Data Feed for DApps"
        description={`is designed as a community governed and managed price
          feed for decentralized applications. New possibilities will be opened
          for applications such that rely on price information such as `}
        link1="data.bandprotocol.com"
        link2="Token Curated DataSource"
        Logo={AppDS}
        Img1={SSExample4}
        Img2={SSExample5}
        Img3={SSExample6}
      />
      <Box py={5} style={{ background: '#17192e' }}>
        <StartBuilding />
      </Box>
    </Box>
  )
}
