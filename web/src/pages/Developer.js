import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
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
                Developer Forum
              </OutlineButton>
            </AbsoluteLink>
            <Flex mx={['0px', '10px']} my={['10px', '0px']} />
            <AbsoluteLink href="/whitepaper-3.0.0.pdf">
              <FilledButton isMobile={_isMobile}>Developer Doc</FilledButton>
            </AbsoluteLink>
          </Flex>

          {/* Section2: Real-time DataSources */}
          <Flex
            pt={['50px', '20px']}
            pb={['50px', '20px']}
            justifyContent="center"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '30px']}
              color="#4a4a4a"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Real-time Datasets
            </Text>
          </Flex>

          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column" alignItems="center">
              <Box width="300px" bg="red" style={{ height: '300px' }} />
              <Text fontWeight="bold" fontSize="24px" mt="25px" mb="20px">
                Price Feeds
              </Text>
              <Text
                color="#323232"
                fontWeight="300"
                bg="#c7c5c5"
                fontSize="16px"
                p="6px 8px"
                textAlign="center"
              >
                0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize="14px"
                style={{ maxWidth: '300px', lineHeight: '2' }}
              >
                Current prices of popular trading cryptocurrency, FX, and US
                equity pairs
              </Text>
              <Text fontWeight="bold" fontSize="16px" my="30px">
                Integration
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Box width="300px" bg="red" style={{ height: '300px' }} />
              <Text fontWeight="bold" fontSize="24px" mt="25px" mb="20px">
                Sport Events
              </Text>
              <Text
                color="#323232"
                fontWeight="300"
                bg="#c7c5c5"
                fontSize="16px"
                p="6px 8px"
                textAlign="center"
              >
                0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize="14px"
                style={{ maxWidth: '300px', lineHeight: '2' }}
              >
                Accurate live scores from soccer, basketball, American football
                and baseball
              </Text>
              <Text fontWeight="bold" fontSize="16px" my="30px">
                Integration
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Box width="300px" bg="red" style={{ height: '300px' }} />
              <Text fontWeight="bold" fontSize="24px" mt="25px" mb="20px">
                Lottery Results
              </Text>
              <Text
                color="#323232"
                fontWeight="300"
                bg="#c7c5c5"
                fontSize="16px"
                p="6px 8px"
                textAlign="center"
              >
                0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d
              </Text>
              <Text
                textAlign="center"
                fontWeight="300"
                fontSize="14px"
                style={{ maxWidth: '300px', lineHeight: '2' }}
              >
                Winning numbers of lotteries all around the world
              </Text>
              <Text fontWeight="bold" fontSize="16px" my="30px">
                Integration
              </Text>
            </Flex>
          </Flex>

          {/* Section 3 : Data Requests on Any Open API */}
          <Flex
            pt={['50px', '20px']}
            pb={['50px', '20px']}
            alignItems="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '30px']}
              color="#4a4a4a"
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

            <Box width="100%" my="60px" bg="blue" style={{ height: '500px' }} />
          </Flex>

          {/* Learn More in Developer Doc */}
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
                Learn More in Developer Doc
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
