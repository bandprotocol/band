import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import FilledButton from 'components/FilledButton'
import LinkWithArrow from 'components/LinkWithArrow'
import { Flex, Text, Button, Image, Box } from 'ui/common'
import { isMobile } from 'ui/media'

import SimpleIntegration from 'images/simple-integration.svg'
import SecureDecentralized from 'images/secure-decentrailized.svg'
import EconomicallySound from 'images/economically-sound.svg'
import Usecase1 from 'images/usecase1.jpg'
import Usecase2 from 'images/usecase2.jpg'
import Usecase3 from 'images/usecase3.jpg'
import Usecase4 from 'images/usecase4.jpg'
import Usecase5 from 'images/usecase5.jpg'
import Usecase6 from 'images/usecase6.jpg'
import BandOffering from 'images/comparison-table.jpg'

export default () => {
  const exRef = useRef(null)
  const _isMobile = isMobile()
  return (
    <Box
      style={{
        background: 'white',
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
              lineHeight={1.3}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['24px', '48px']}
              color="#3b426b"
              textAlign="center"
              mt={['30px', '0px']}
              style={{ fontFamily: 'bio-sans' }}
            >
              A One-Stop Framework for
              <br />
              Decentralized Management of Data
            </Text>
          </Flex>

          {/* Simple Integration */}
          <Flex
            width="100%"
            flexDirection={['column', 'row']}
            justifyContent="space-between"
            mt={['0px', '30px']}
            style={{ maxWidth: 1080 }}
            mx="auto"
          >
            <Flex
              flexDirection="column"
              alignItems="center"
              mb={['50px', '0px']}
            >
              <Box style={{ height: '110px' }}>
                <Image src={SimpleIntegration} />
              </Box>
              <Text
                fontWeight="bold"
                color="#3b426b"
                fontSize={['20px', '22px']}
                mt="25px"
                mb="20px"
              >
                Simple Integration
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize={['14px', '16px']}
                mb={['0px', '20px']}
                style={{
                  maxWidth: '300px',
                  lineHeight: '1.8',
                  height: '100px',
                }}
              >
                Integrate existing data feeds to a dApp takes less than 10 lines
                of code.
              </Text>
              <LinkWithArrow
                text="Developer Doc"
                href="https://developer.bandprotocol.com/"
              />
            </Flex>

            {/* Secure & Decentralized */}
            <Flex
              flexDirection="column"
              alignItems="center"
              mb={['50px', '0px']}
            >
              <Box style={{ height: '110px' }}>
                <Image src={SecureDecentralized} />
              </Box>
              <Text
                fontWeight="bold"
                color="#3b426b"
                fontSize={['20px', '22px']}
                mt="25px"
                mb="20px"
              >
                {'Secure & Decentralized'}
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize={['14px', '16px']}
                mb="20px"
                style={{
                  maxWidth: '300px',
                  lineHeight: '1.8',
                  height: '100px',
                }}
              >
                Leverage built-in delegated consensus to distribute risk of
                collusion in the decentralized platform.
              </Text>
              <LinkWithArrow
                text="Whitepaper v3.1"
                href="/whitepaper-3.0.1.pdf"
              />
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Box style={{ height: '110px' }}>
                <Image src={EconomicallySound} />
              </Box>
              <Text
                fontWeight="bold"
                color="#3b426b"
                fontSize={['20px', '22px']}
                mt="25px"
                mb="20px"
              >
                Economically Sound
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize={['14px', '16px']}
                mb="20px"
                style={{
                  maxWidth: '300px',
                  lineHeight: '1.8',
                  height: '100px',
                }}
              >
                Incentives encourage competitions to drive unit data costs down
                without compromising security.
              </Text>
              <LinkWithArrow text="Learn more" to="/features/dual-token" />
            </Flex>
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 2 : Comparing to other Frameworks */}
      <Box>
        <PageContainer>
          <Flex
            mt={6}
            pt={['50px', '50px']}
            pb={['50px', '60px']}
            justifyContent="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={300}
              fontSize={['18px', '28px']}
              color="#5569de"
              textAlign="center"
            >
              Comparing to Other Frameworks
            </Text>

            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['24px', '48px']}
              color="#3b426b"
              textAlign="center"
              fontFamily="bio-sans"
            >
              What Band Protocol Offers
            </Text>

            <Box
              width="100%"
              mt={['10px', '30px']}
              style={{
                height: _isMobile ? '150px' : '540px',
                backgroundImage: `url(${BandOffering})`,
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 3: Use cases */}
      <Box
        bg="white"
        mt={['0px', '100px']}
        mb={['50px', '100px']}
        style={{ maxWidth: 1080 }}
        mx="auto"
      >
        <PageContainer>
          <Text
            lineHeight={1.6}
            fletterSpacing="1px"
            fontWeight={300}
            fontSize={['18px', '28px']}
            color="#5569de"
            textAlign="center"
          >
            Leveraging Band Data Infrastructure
          </Text>

          <Text
            lineHeight={1.6}
            fletterSpacing="1px"
            fontWeight={600}
            fontSize={['24px', '48px']}
            color="#3b426b"
            textAlign="center"
          >
            Use Cases of Datasets
          </Text>

          {/* Part 1 */}
          <Flex
            justifyContent="space-between"
            mt={['25px', '50px']}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Image
              src={Usecase1}
              style={{ maxWidth: _isMobile ? '300px' : '500px' }}
            />
            <Flex
              flexDirection="column"
              pl={['10px', '74px']}
              mt={['20px', '0px']}
              pr={['10px', '0px']}
            >
              <Text
                fontSize={['18px', '18px']}
                color="#3b426b"
                fontWeight="bold"
              >
                Decentralized Finance (DeFi)
              </Text>
              <Text
                fontSize={['14px', '16px']}
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '700px' }}
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
          <Flex
            justifyContent="space-between"
            mt={['40px', '50px']}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            {_isMobile ? (
              <Image
                src={Usecase2}
                style={{ maxWidth: _isMobile ? '300px' : '500px' }}
              />
            ) : null}
            <Flex
              flexDirection="column"
              pl={['10px', '0px']}
              mt={['20px', '0px']}
              pr={['10px', '74px']}
            >
              <Text fontSize="18px" color="#3b426b" fontWeight="bold">
                Payments for Decentralized Commerce
              </Text>
              <Text
                fontSize={['14px', '16px']}
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '700px' }}
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
            {_isMobile ? null : (
              <Image src={Usecase2} style={{ maxWidth: '500px' }} />
            )}
          </Flex>

          {/* Part 3 */}
          <Flex
            justifyContent="space-between"
            mt={['40px', '50px']}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Image
              src={Usecase3}
              style={{ maxWidth: _isMobile ? '300px' : '500px' }}
            />
            <Flex
              flexDirection="column"
              pl={['10px', '74px']}
              mt={['20px', '0px']}
              pr={['10px', '0px']}
            >
              <Text fontSize="18px" color="#3b426b" fontWeight="bold">
                Gaming, Gambling, and Prediction Markets
              </Text>
              <Text
                fontSize={['14px', '16px']}
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '700px' }}
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
          <Flex
            justifyContent="space-between"
            mt={['40px', '50px']}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            {_isMobile ? (
              <Image
                src={Usecase4}
                style={{ maxWidth: _isMobile ? '300px' : '500px' }}
              />
            ) : null}
            <Flex
              flexDirection="column"
              pl={['10px', '0px']}
              mt={['20px', '0px']}
              pr={['10px', '74px']}
            >
              <Text fontSize="18px" color="#3b426b" fontWeight="bold">
                Supply Chain Tracking
              </Text>
              <Text
                fontSize={['14px', '16px']}
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '700px' }}
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
            {_isMobile ? null : (
              <Image src={Usecase4} style={{ maxWidth: '500px' }} />
            )}
          </Flex>

          {/* Part 5 */}
          <Flex
            justifyContent="space-between"
            mt={['40px', '50px']}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            <Image
              src={Usecase5}
              style={{ maxWidth: _isMobile ? '300px' : '500px' }}
            />
            <Flex
              flexDirection="column"
              pl={['10px', '74px']}
              mt={['20px', '0px']}
              pr={['10px', '0px']}
            >
              <Text fontSize="18px" color="#3b426b" fontWeight="bold">
                Identity Layer
              </Text>
              <Text
                fontSize={['14px', '16px']}
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '700px' }}
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
          <Flex
            justifyContent="space-between"
            mt={['40px', '50px']}
            alignItems="center"
            flexDirection={['column', 'row']}
          >
            {_isMobile ? (
              <Image
                src={Usecase6}
                style={{ maxWidth: _isMobile ? '300px' : '500px' }}
              />
            ) : null}
            <Flex
              flexDirection="column"
              pl={['10px', '0px']}
              mt={['20px', '0px']}
              pr={['10px', '74px']}
            >
              <Text fontSize="18px" color="#3b426b" fontWeight="bold">
                Open Internet API connection
              </Text>
              <Text
                fontSize={['14px', '16px']}
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '700px' }}
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
            {_isMobile ? null : (
              <Image src={Usecase6} style={{ maxWidth: '500px' }} />
            )}
          </Flex>

          {/* Next: Dual-toiken Econimics */}
          <Flex justifyContent="center" mt={['50px', '120px']}>
            <FilledButton
              width={_isMobile ? '300px' : '400px'}
              message="Next: Dual-token Economics"
              arrow
              fontSize={_isMobile ? '14px' : '16px'}
              to="/features/dual-token"
            />
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
