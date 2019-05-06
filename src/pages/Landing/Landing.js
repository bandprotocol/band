import React from 'react'
import styled from 'styled-components'
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

import HeroSrc from 'images/landing-hero.svg'
import BandInTheMiddle from 'images/bandInTheMiddle.svg'
import Sequoia from 'images/sequoia.svg'
import Dunamu from 'images/dunamu.svg'
import Reddit from 'images/reddit.svg'
import Telegram from 'images/telegram.svg'
import Medium from 'images/medium.svg'
import Twitter from 'images/twitter.svg'
import AppCHT from 'images/appCoinhatcher.svg'
import AppDS from 'images/appDataSource.svg'
import LandingBandDB from 'images/landingBandDB.svg'
import LandingDataGov from 'images/landingDataGov.svg'
import LandingStartBuilding from 'images/landingStartBuilding.svg'
import Seax from 'images/seax.png'
import SSExample1 from 'images/SSExample1.png'
import SSExample2 from 'images/SSExample2.png'

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
`

const OutlineButton = styled(Button)`
  color: #f7f8ff;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0);
  width: 182px;
  height: 46px;
  border-radius: 6px;
  border: solid 1px ${props => props.borderColor};
  cursor: pointer;
`

export default class LandingPage extends React.Component {
  render() {
    return (
      <Box style={{ color: '#ffffff' }}>
        <Box style={{ background: colors.gradient.dark }}>
          <PageContainer>
            <Flex py={5}>
              <Box flex={1}>
                <Text
                  lineHeight={1.6}
                  fletterSpacing="1px"
                  ontWeight="600"
                  fontSize="40px"
                  fontFamily="Avenir-Heavy"
                >
                  Decentralized
                  <br />
                  Data Governance
                </Text>
                <Flex mt="25px" style={{ maxWidth: '390px' }}>
                  <Text
                    color="#f7f8ff"
                    fontSize="24px"
                    lineHeight={1.54}
                    fontWeight={300}
                  >
                    An open standard for decentralized management of data on
                    Web3 stack
                  </Text>
                </Flex>
                <Flex mt="30px">
                  <OutlineButton borderColor="#6b7df5">
                    Learn More
                  </OutlineButton>
                  <Flex mx="10px" />
                  <FilledButton>Start Building</FilledButton>
                </Flex>
              </Box>
              <Box flex={1}>
                <Image src={HeroSrc} height="320" />
              </Box>
            </Flex>
            <Flex
              bg="#36406e"
              py="40px"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              style={{
                width: '940px',
                height: '370px',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
              }}
            >
              <Image src={BandInTheMiddle} width="729px" />
              <Flex style={{ maxWidth: '650px' }}>
                <Text
                  textAlign="center"
                  fontSize="20px"
                  fontWeight={300}
                  lineHeight={1.65}
                >
                  Band Protocol is a component layer solution for managing data
                  in the Web3 technology stack. DApps consume data via BAND
                  public smart contract datasets rather than through external
                  oracles.
                </Text>
              </Flex>
              <Flex alignItems="center" mt="35px">
                <Button
                  bg="rgba(0,0,0,0)"
                  fontWeight={400}
                  fontSize="20px"
                  lineHeight={1.45}
                >
                  Example Usecases
                </Button>
                <Text color="#5eebbe" fontSize="20px">
                  <i className="fas fa-arrow-right" />
                </Text>
              </Flex>
            </Flex>
            <Box pt={6} pb={6}>
              <Text
                textAlign="center"
                fontWeight={900}
                fontSize="34px"
                letterSpacing="1.3px"
              >
                Band Protocol Provides
              </Text>
              <Flex my="5px" />
              <Text
                color="#f7f8ff"
                textAlign="center"
                fontWeight={400}
                fontSize="25px"
                lineHeight={1.16}
              >
                Reliable Datasets for Enterprises, Developers and Communities
              </Text>
            </Box>
            <Flex flexDirection="row" justifyContent="center">
              <Flex
                bg="#f7f8ff"
                style={{
                  width: '425px',
                  height: '325px',
                  borderRadius: '10px',
                  boxShadow: '0 23px 20px 0 rgba(0, 0, 0, 0.25)',
                }}
                flexDirection="column"
              >
                <Flex pt="30px" pl="30px" flexDirection="column">
                  <Text color="#6b8bf5" fontWeight={900}>
                    Develop using
                  </Text>
                  <Flex my="5px" />
                  <Text color="#2b314f" fontWeight={900} fontSize="24px">
                    Band Datasets
                  </Text>
                  <Flex my="5px" />
                  <Text
                    fontWeight={300}
                    lineHeight={1.57}
                    color="#4c4c4c"
                    fontSize="14px"
                  >
                    Take advantage of Token Curated DataSource as a trusted
                    source of crypto price, sport and loterry.
                  </Text>
                </Flex>
                <Flex my="15px" />
                <Image src={LandingBandDB} width="100%" />
                <Flex
                  pl="30px"
                  style={{
                    borderTop: '1px solid #eaeeff',
                    position: 'relative',
                    height: '100%',
                  }}
                  alignItems="center"
                >
                  <Text color="#252945">Integrate Data with your DApps</Text>
                  <Flex style={{ position: 'absolute', right: '30px' }}>
                    <Text color="#6b8bf5" fontWeight={900}>
                      <i className="fas fa-chevron-right" />
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex mx="18px" />
              <Flex
                bg="#f7f8ff"
                style={{
                  width: '425px',
                  height: '325px',
                  borderRadius: '10px',
                  boxShadow: '0 23px 20px 0 rgba(0, 0, 0, 0.25)',
                }}
                flexDirection="column"
              >
                <Flex
                  pt="30px"
                  pl="30px"
                  flexDirection="column"
                  style={{ maxWidth: '240px' }}
                >
                  <Text color="#6b8bf5" fontWeight={900}>
                    Participate in
                  </Text>
                  <Flex my="5px" />
                  <Text color="#2b314f" fontWeight={900} fontSize="24px">
                    Data Governance
                  </Text>
                  <Flex my="5px" />
                  <Text
                    fontWeight={300}
                    lineHeight={1.57}
                    color="#4c4c4c"
                    fontSize="14px"
                  >
                    Stake on data providers you trust and earn provider fee.
                  </Text>
                </Flex>
                <Flex mt="30px" pl="30px" mb="30px">
                  <Image src={LandingDataGov} width="213px" />
                </Flex>
                <Flex
                  pl="30px"
                  style={{
                    borderTop: '1px solid #eaeeff',
                    position: 'relative',
                    height: '100%',
                  }}
                  alignItems="center"
                >
                  <Text color="#252945">Governance Portal</Text>
                  <Flex style={{ position: 'absolute', right: '30px' }}>
                    <Text color="#6b8bf5" fontWeight={900}>
                      <i className="fas fa-chevron-right" />
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex mt="75px" flexDirection="row" justifyContent="center">
              <Flex
                bg="rgba(0,0,0,0)"
                flexDirection="column"
                style={{
                  width: '425px',
                  height: '325px',
                }}
                pl="40px"
              >
                <Flex>
                  <Text fontSize="22px" fontWeight={900} color="#8d94bf">
                    Partnerships Featuring
                  </Text>
                </Flex>
                <Flex mt="40px">
                  <Image src={Sequoia} width="148px" />
                </Flex>
                <Flex mt="35px">
                  <Image src={Dunamu} width="245px" />
                </Flex>
                <Flex mt="35px">
                  <Image src={Seax} width="110px" height="50px" />
                </Flex>
              </Flex>
              <Flex mx="18px" />
              <Flex
                bg="rgba(0,0,0,0)"
                flexDirection="column"
                px="40px"
                style={{
                  width: '425px',
                  height: '325px',
                }}
              >
                <Flex>
                  <Text fontSize="22px" fontWeight={900} color="#8d94bf">
                    Join Band Protocol Community
                  </Text>
                </Flex>
                <Flex fontSize="18px" mt="40px" alignItems="center">
                  <Image src={Reddit} width="30px" />
                  <Flex mx="20px" />
                  Reddit
                  <Flex mx="20px" />
                </Flex>
                <Flex fontSize="18px" mt="35px" alignItems="center">
                  <Image src={Telegram} width="30px" />
                  <Flex mx="20px" />
                  Telegram
                </Flex>
                <Flex fontSize="18px" mt="35px" alignItems="center">
                  <Image src={Medium} width="30px" />
                  <Flex mx="20px" />
                  Medium
                </Flex>
                <Flex fontSize="18px" mt="35px" alignItems="center">
                  <Image src={Twitter} width="30px" />
                  <Flex mx="20px" />
                  Twitter
                </Flex>
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
          Img2={SSExample1}
          Img3={SSExample1}
        />
        <LandingShowcase
          background="#21253f"
          title="Community Curated Data Feed for DApps"
          description={`is designed as a community governed and managed price
          feed for decentralized applications. New possibilities will be opened
          for applications such that rely on price information such as `}
          link1="data.bandprotocol.com"
          link2="Token Curated DataSource"
          Logo={AppDS}
          Img1={SSExample2}
          Img2={SSExample2}
          Img3={SSExample2}
        />
        <Box py={5} style={{ background: '#17192e' }}>
          <PageContainer>
            <Flex
              pt="65px"
              pb="35px"
              px="100px"
              style={{
                borderRadius: '10px',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
                background: 'linear-gradient(to left, #6083ff, #8266ff)',
              }}
            >
              <Flex style={{ width: '620px' }} flexDirection="column">
                <Text fontWeight="600" fontSize="32px">
                  Want to start building?
                </Text>
                <Flex my="10px" />
                <Text fontSize="20px">
                  Integrating your product right away with Band Protocol SDK
                </Text>
                <Flex mt="40px">
                  <a
                    href="https://developer.bandprotocol.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OutlineButton
                      borderColor="white"
                      style={{
                        width: '220px',
                      }}
                    >
                      Technical Doc
                    </OutlineButton>
                  </a>
                  <Flex mx="10px" />
                  <FilledButton
                    style={{
                      width: '220px',
                      backgroundImage:
                        'linear-gradient(249deg, #454366, #3a3d5a)',
                    }}
                  >
                    Developer Portal
                  </FilledButton>
                </Flex>
              </Flex>
              <Flex>
                <Image src={LandingStartBuilding} width="266px" />
              </Flex>
            </Flex>
            <Flex />
          </PageContainer>
        </Box>
      </Box>
    )
  }
}
