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
      <Box pt="60px" bg="f2f2f2">
        <PageContainer>
          <Flex
            pt={['50px', '100px']}
            pb={['50px', '60px']}
            justifyContent="center"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '48px']}
              color="#4a4a4a"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              A One-Stop Framework for
              <br />
              Decentralized Management of Data
            </Text>
          </Flex>

          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column" alignItems="center">
              <Box width="300px" bg="red" style={{ height: '300px' }} />
              <Text fontWeight="bold" fontSize="24px" mt="25px" mb="20px">
                Simple Integration
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize="14px"
                style={{ maxWidth: '300px', lineHeight: '2' }}
              >
                Integrate existing data feeds to a dApp takes less than 10 lines
                of code.
              </Text>
              <Text fontWeight="bold" fontSize="16px" my="30px">
                Developer Doc
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Box width="300px" bg="red" style={{ height: '300px' }} />
              <Text fontWeight="bold" fontSize="24px" mt="25px" mb="20px">
                {'Secure & Decentralized'}
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize="14px"
                style={{ maxWidth: '300px', lineHeight: '2' }}
              >
                Leverage built-in delegated consensus to distribute risk of
                collusion in the decentralized platform.
              </Text>
              <Text fontWeight="bold" fontSize="16px" my="30px">
                Whitepaper v3.0
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Box width="300px" bg="red" style={{ height: '300px' }} />
              <Text fontWeight="bold" fontSize="24px" mt="25px" mb="20px">
                Economically Sound
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize="14px"
                style={{ maxWidth: '300px', lineHeight: '2' }}
              >
                Incentives encourage competitions to drive unit data costs down
                without compromising security.
              </Text>
              <Text fontWeight="bold" fontSize="16px" my="30px">
                Learn more
              </Text>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>

      <Box>
        <PageContainer>
          <Flex
            pt={['50px', '50px']}
            pb={['50px', '60px']}
            justifyContent="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={300}
              fontSize={['32px', '32px']}
              color="#4a4a4a"
              textAlign={['center', 'center']}
            >
              Comparing to Other Frameworks
            </Text>

            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '48px']}
              color="#4a4a4a"
              textAlign={['center', 'center']}
            >
              What Band Protocol Offers
            </Text>

            <Box width="100%" bg="blue" style={{ height: '600px' }} mt="30px" />
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 4 */}
      <Box bg="#f0f0f0" mt="50px">
        <PageContainer>
          <Text
            lineHeight={1.6}
            fletterSpacing="1px"
            fontWeight={300}
            fontSize={['32px', '32px']}
            color="#4a4a4a"
            textAlign={['center', 'center']}
          >
            Leveraging Band Data Infrastructure
          </Text>

          <Text
            lineHeight={1.6}
            fletterSpacing="1px"
            fontWeight={600}
            fontSize={['32px', '48px']}
            color="#4a4a4a"
            textAlign={['center', 'center']}
          >
            Use Cases of Datasets
          </Text>

          {/* Part 1 */}
          <Flex justifyContent="space-between" mt="40px" alignItems="center">
            <Box width="200px" bg="black" style={{ height: '200px' }} />
            <Flex flexDirection="column" pl="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Decentralized Finance (DeFi)
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                mt="10px"
              >
                The majority of existing decentralized finance (DeFi)
                applications share one critical source of risk: Price Feed
                Oracle. Reputable projects such as MakerDAO, Compound, Dharma,
                dYdX, or SET Protocol, rely on only a relatively small number of
                trusted developers to provide off-chain price information to the
                protocol. Band Protocol fills this need, providing critical
                information securely allowing projects to focus on what they do
                best. This also extends to future decentralized financial
                application such as derivative trading of real-world asset which
                requires knowledge of real-world data such as interest rate,
                foreign exchange rate, price of securities such as stocks, bonds
                and commodities.
              </Text>
            </Flex>
          </Flex>

          {/* Part 2 */}
          <Flex justifyContent="space-between" mt="40px" alignItems="center">
            <Flex flexDirection="column" pr="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Payments for Decentralized Commerce
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                mt="10px"
              >
                Many decentralized applications utilize tokens as a mean of
                payment, which requires them to price their products and
                services in token term. However, this is difficult because these
                applications usually price their offers in stable fiat value
                whereas these tokens have high price volatility. Hence, they
                need a mechanic to continuously convert their fiat value to
                token value which requires a reliable, constant feed of
                crypto-fiat price.
              </Text>
            </Flex>
            <Box width="200px" bg="black" style={{ height: '200px' }} />
          </Flex>

          {/* Part 3 */}
          <Flex justifyContent="space-between" mt="40px" alignItems="center">
            <Box width="200px" bg="black" style={{ height: '200px' }} />
            <Flex flexDirection="column" pl="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Gaming, Gambling, and Prediction Markets
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                mt="10px"
              >
                Gaming and gambling have been one of biggest sectors in the
                blockchain ecosystem. By utilizing Band Protocol, dApps can
                access trusted real-world information that is not controlled by
                a single source of truth.
              </Text>
            </Flex>
          </Flex>

          {/* Part 4 */}
          <Flex justifyContent="space-between" mt="40px" alignItems="center">
            <Flex flexDirection="column" pr="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Supply Chain Tracking
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                mt="10px"
              >
                Buying and selling real-world products in a fully trustless way
                using cryptocurrency is near impossible with current technology.
                Band Protocol allows supply-chain related data such as item
                shipments or non-blockchain payments. Smart contracts can verify
                such information on-chain and perform financial logic
                accordingly.
              </Text>
            </Flex>
            <Box width="200px" bg="black" style={{ height: '200px' }} />
          </Flex>

          {/* Part 5 */}
          <Flex justifyContent="space-between" mt="40px" alignItems="center">
            <Box width="200px" bg="black" style={{ height: '200px' }} />
            <Flex flexDirection="column" pl="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Identity Layer
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                mt="10px"
              >
                Many decentralized applications struggle to deal with fake
                accounts and Sybil attacks. As founder of Ethereum, Vitalik
                Buterin suggests, identity layer is one of the most crucial
                parts for building collusion-resistant tokenomic system. Band
                Protocol can serve as a platform for different identity services
                to together curate identity information, ready to be consumed by
                applications via a simple query interface.
              </Text>
            </Flex>
          </Flex>

          {/* Part 6 */}
          <Flex justifyContent="space-between" mt="40px" alignItems="center">
            <Flex flexDirection="column" pr="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Open Internet API connection
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                mt="10px"
              >
                Smart contracts are currently limited because they cannot bridge
                between the Web 2.0 and 3.0 infrastucture. Band Protocol
                supports real-world API connection so smart contracts are fully
                aware of real-world event and also able to supply input to the
                API to trigger specific event. For example, one can connect bank
                API so that smart contract knows exactly when there is an
                off-chain transaction or smart contract may automatically
                trigger off-chain transaction by itself.
              </Text>
            </Flex>
            <Box width="200px" bg="black" style={{ height: '200px' }} />
          </Flex>

          {/* Explore more feature button */}
          <Flex justifyContent="center" maxWidth="500px" my="50px">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              bg="#4a4a4a"
              p="16px 15px"
              width="100%"
              style={{ maxWidth: '500px', borderRadius: '4px' }}
            >
              <Text color="white" fontSize="16px">
                Next: Dual-token Economics
              </Text>
              {/* TODO: change it into actual symbol */}
              <Text color="white" fontSize="16px">
                ->
              </Text>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
