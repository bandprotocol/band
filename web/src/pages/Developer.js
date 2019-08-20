import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import FilledButton from 'components/FilledButton'
import ArrowRight from 'components/ArrowRight'
import LinkWithArrow from 'components/LinkWithArrow'
import {
  Flex,
  Text,
  Button,
  Image,
  Box,
  AbsoluteLink,
  Highlight,
} from 'ui/common'
import { isMobile } from 'ui/media'

import PriceHero from 'images/price-hero.png'
import SportHero from 'images/sport-hero.png'
import LotteryHero from 'images/lottery-hero.png'
import DataRequest from 'images/data-requests.png'
import { is } from 'css-select'

const OutlineButton = styled(Button)`
  font-family: Avenir;
  color: #3b426b;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  width: ${props => (props.isMobile ? '227px' : '196px')};
  height: 46px;
  border-radius: 2px;
  cursor: pointer;
  border: solid 0.7px #3b426b;

  transition: all 0.2s;

  &:active {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }
`

const Dataset = ({ image, title, address, detail }) => {
  const _isMobile = isMobile()
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      mb="30px"
    >
      <Image
        src={image}
        width="263px"
        ml="100px"
        style={{ maxHeight: '250px' }}
      />
      <Text fontWeight="bold" fontSize="24px" mt="25px" mb="20px">
        {title}
      </Text>
      <Text
        color="#5569de"
        fontWeight="400"
        bg="#e9edff"
        fontSize="14px"
        lineHeight={1.5}
        p="6px 8px"
        textAlign="center"
        fontFamily="Source Code Pro"
        mt="10px"
        style={{
          maxWidth: _isMobile ? '300px' : '100vw',
          wordBreak: 'break-all',
        }}
      >
        {address}
      </Text>
      <Text
        textAlign="center"
        fontWeight="300"
        fontSize="14px"
        style={{ maxWidth: '300px', lineHeight: '2' }}
      >
        {detail}
      </Text>
      <Flex justifyContent="center" alignItems="center">
        <LinkWithArrow text="Integration" />
      </Flex>
    </Flex>
  )
}

export default () => {
  const _isMobile = isMobile()
  const [videoWidth, setVideoWidth] = useState(1200)
  let video = useRef()

  useEffect(() => {
    setVideoWidth(video.current.offsetWidth || 1200)
  }, [])
  return (
    <Box
      style={{
        color: '#323232',
        overflow: 'hidden',
      }}
      mt="-80px"
    >
      {/* Section 1 */}
      <Box pt="60px" bg="white">
        <PageContainer>
          <Flex
            pt={['50px', '100px']}
            pb={['50px', '40px']}
            alignItems="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '48px']}
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Integrating Off-Chain Information to
              <br />
              Your dApps with Band Protocol
            </Text>
            <Text
              textAlign="center"
              mt="20px"
              color="#323232"
              fontWeight="400"
              style={{ lineHeight: '2', maxWidth: '600px' }}
            >
              Band is a middleware layer protocol that connects dApps with
              trusted off-chain data. Guaranteed by strong economic incentives,
              the datasets present unmatched reliability and availability
              previously unavailable on blockchain.
            </Text>
          </Flex>

          <Flex justifyContent="center" alignItems="center">
            <Flex
              bg="#e9edff"
              alignItems="center"
              justifyContent="center"
              width="500px"
            >
              <Box
                bg="#33cf41"
                width="10px"
                mr="15px"
                style={{ borderRadius: '50%', height: '10px' }}
              />
              <Text
                fontFamily="bio-sans"
                fontSize="16px"
                fontWeight="bold"
                color="#5569de"
                lineHeight={2.6}
              >
                Live on Kovan Testnet
              </Text>
            </Flex>
          </Flex>

          <Flex
            mt={['40px', '50px']}
            justifyContent="center"
            alignItems={['center', 'flex-start']}
            flexDirection={['column', 'row']}
          >
            <AbsoluteLink href="https://developer.bandprotocol.com/">
              <OutlineButton isMobile={_isMobile}>
                <Flex width="100%" justifyContent="space-between">
                  Developer Forum
                  <ArrowRight color="#3b426b" />
                </Flex>
              </OutlineButton>
            </AbsoluteLink>
            <Flex mx={['0px', '10px']} my={['10px', '0px']} />
            <AbsoluteLink href="/whitepaper-3.0.0.pdf">
              <FilledButton message="Developer Doc" arrow width="227px" />
            </AbsoluteLink>
          </Flex>

          {/* Section2: Embedded Video */}
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt="80px"
            flex="auto"
          >
            <Flex style={{ width: '100%', maxWidth: 1200 }}>
              <iframe
                title="video"
                frameBorder="0"
                allowFullScreen
                ref={video}
                style={{
                  width: '100%',
                  height: Math.floor(videoWidth / 1.7777) + 'px',
                }}
                src={'https://www.youtube.com/embed/O5KpoWT4Gpw?enablejsapi=1'}
              />
            </Flex>
            <Flex
              py="20px"
              px="20px"
              style={{ width: '100%', maxWidth: '1200px' }}
              justifyContent="center"
              alignItems="center"
              bg="#edf0ff"
              color="#404fac"
            >
              <Text
                fontFamily="bio-sans"
                fontSize="16px"
                textAlign="center"
                lineHeight={1.5}
              >
                Check out more vidoe tutorials at our{' '}
                <AbsoluteLink
                  href={
                    'https://www.youtube.com/channel/UCmmNlun2aMmOaIEQ3H-htuw'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <Highlight color="#5569de">Youtube channel</Highlight>
                </AbsoluteLink>
              </Text>
            </Flex>
          </Flex>

          {/* Section3: Real-time DataSources */}
          <Flex
            pt={['50px', '40px']}
            pb={['50px', '20px']}
            justifyContent="center"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '40px']}
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
              mb="40px"
            >
              Real-time Datasets
            </Text>
          </Flex>

          <Flex width="100%" justifyContent="space-between" flexWrap="wrap">
            {/* Price Feeds */}
            <Dataset
              title="Price Feeds"
              image={PriceHero}
              address="0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d"
              detail="Current prices of popular trading cryptocurrency, FX, and US equity pairs"
            />
            {/* Sport Event */}
            <Dataset
              title="Sport Events"
              image={SportHero}
              address="0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d"
              detail="Accurate live scores from soccer, basketball, American football
              and baseball"
            />
            {/* Lottery Result */}
            <Dataset
              title="Lottery Results"
              image={LotteryHero}
              address="0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d"
              detail="  Winning numbers of lotteries all around the world"
            />
          </Flex>

          {/* Section 3 : Data Requests on Any Open API */}
          <Flex
            pt={['30px', '50px']}
            pb={['50px', '20px']}
            alignItems="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '30px']}
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Data Requests on Any Open API
            </Text>
            <Text
              textAlign="center"
              mt="20px"
              style={{ lineHeight: '2', maxWidth: '900px' }}
            >
              Band provides a framework for decentralized data requests over the
              internet and bring the result over to blockchain without
              introducing any centralized point of trust. dApp developers can
              now take advantage of existing information infrastructure of the
              internet without compromising on security and decentralization.
            </Text>

            <Image src={DataRequest} width="100%" mt="50px" />

            <Flex
              mt="60px"
              flexDirection={['column', 'row']}
              justifyContent="space-evenly"
              width="80%"
            >
              <LinkWithArrow text="Explore Existing Endpoints" />
              {_isMobile && (
                <Flex>
                  <br />
                  <br />
                </Flex>
              )}
              <LinkWithArrow text="How to Add a New Endpoint" />
            </Flex>
          </Flex>

          {/* Section 4: Tutorial on data integrations */}
          {/*<Flex flexDirection="column" alignItems="center" mt={['0px', '50px']}>
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '30px']}
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Tutorial on Data Integrations
            </Text>
            <Flex flexWrap="wrap" mt="30px" width="90%" justifyContent="center">
              <Flex
                flexDirection="column"
                alignItems="center"
                width="380px"
                mx="30px"
              >
                <Box width="100%" bg="pink" style={{ height: '200px' }} />
                <Text
                  color="#4a4a4a"
                  fontSize="16px"
                  fontFamily="bio-sans"
                  mt="15px"
                  fontWeight="800"
                  lineHeight={1.5}
                >
                  How to Integrate Off-Chain Data to Your Smart Contracts
                </Text>
              </Flex>
              <Flex flexDirection="column" alignItems="center" width="380px">
                <Box width="100%" bg="pink" style={{ height: '200px' }} />
                <Text
                  color="#4a4a4a"
                  fontSize="16px"
                  fontFamily="bio-sans"
                  mt="15px"
                  fontWeight="800"
                  lineHeight={1.5}
                >
                  Writing a Global Stock Market with Decentralized Price
                  Reference
                </Text>
              </Flex>
              <Flex
                flexDirection="column"
                alignItems="center"
                width="380px"
                m="30px"
              >
                <Box width="100%" bg="pink" style={{ height: '200px' }} />
                <Text
                  color="#4a4a4a"
                  fontSize="16px"
                  fontFamily="bio-sans"
                  mt="15px"
                  fontWeight="800"
                  lineHeight={1.5}
                >
                  Using Band Protocol to Trade BNB on Binance Chain with ETH
                  through Ethereum Smart Contract
                </Text>
              </Flex>
              <Flex
                flexDirection="column"
                alignItems="center"
                width="380px"
                mt="30px"
              >
                <Box width="100%" bg="pink" style={{ height: '200px' }} />
                <Text
                  color="#4a4a4a"
                  fontSize="16px"
                  fontFamily="bio-sans"
                  mt="15px"
                  fontWeight="800"
                  lineHeight={1.5}
                >
                  Writing a Decentralized Prediction Market with Band Dataset
                </Text>
              </Flex>
            </Flex>
                </Flex> */}

          {/* Learn More in Developer Doc */}
          <Flex justifyContent="center" mt={['0px', '50px']} mb="50px">
            <FilledButton
              width={_isMobile ? '300px' : '500px'}
              fontSize={_isMobile ? '14px' : '16px'}
              message="Learn More in Developer Doc"
              arrow
            />
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
