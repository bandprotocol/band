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
import { isMobile } from 'ui/media'

import StartBuilding from 'components/StartBuilding'

import WhyBand from 'images/whyband.png'
import SDAImg from 'images/solve-data-availability.svg'
import SDRImg from 'images/solve-data-reliability.svg'

export default () => {
  const _isMobile = isMobile()
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={[4, 5]} mb={[3, 4]}>
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              Why Band Protocol
            </Text>
          </Box>
          <Text
            textAlign={['left', 'center']}
            width={['calc(100vw - 40px)', '860px']}
            fontSize={['16px', '18px']}
            lineHeight={[1.63, 1.94]}
          >
            Availability and reliability are the two main problems when
            incorporating data into any decentralized application. Band Protocol
            solves this problem by using incentive structures of tokens to
            ensure data accuracy, while utilizing the openness of blockchain to
            distribute data.
          </Text>
          <Image
            src={WhyBand}
            my={['30px', '70px']}
            width={['calc(100vw - 40px)', '890px']}
          />
          <Card
            bg="#f6f8ff"
            pt={4}
            pb={['30px', '30px']}
            px={['20px', '40px']}
            width={['calc(100vw - 40px)', '840px']}
          >
            <Text
              textAlign={['left', 'center']}
              color="#4c4c4c"
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Applications in Web3.0 are function by distributing the incentive
              across participants of the network, as compared to centralized
              entities in Web2.0. Band provides a standard framework for the
              decentralized management of data, serving as a fundamental query
              layer by providing reliable data for applications that require;
              {_isMobile ? (
                <React.Fragment>
                  <br />
                  <br />
                  • Off-chain oracles
                  <br />
                  • Identity management
                  <br />
                  • KYC / AML
                  <br />
                  • Ranking <br />
                  • Data source for smart contracts
                  <br />
                </React.Fragment>
              ) : (
                <Text width={1} textAlign="left" pl="30%">
                  <br />
                  • Off-chain oracles
                  <br />
                  • Identity management
                  <br />
                  • KYC / AML
                  <br />
                  • Ranking <br />
                  • Data source for smart contracts
                  <br />
                </Text>
              )}
            </Text>
          </Card>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          mb={5}
          mt={5}
          style={{ borderTop: '1px solid #e2e2e2' }}
          pt="50px"
        >
          <Box mb={['30px', '70px']}>
            <H1 textAlign="center" dark>
              Two problems we solve
            </H1>
          </Box>
          <Flex
            width={['calc(100vw - 40px)', '660px']}
            flexDirection={['column', 'row']}
            mb={['430px', '200px']}
          >
            <Flex flex={1} flexDirection="column">
              <Image src={SDAImg} width="100px" />
              <Text my="20px" fontSize="24px">
                Data Availability
              </Text>
              <Text lineHeight={1.5}>
                Band allows DApps to access trusted data synchronously via a
                universal Query Interface, eliminating the need to rely on
                off-chain oracle services
              </Text>
            </Flex>
            <Flex
              flex={1}
              mt={['30px', '0px']}
              ml={['0px', '100px']}
              flexDirection="column"
            >
              <Image src={SDRImg} width="100px" />
              <Text my="20px" fontSize="24px">
                Data Reliability
              </Text>
              <Text lineHeight={1.5}>
                Band incentivizes curators to provide high-quality,
                non-fraudulent data through crypto-economic mechanisms
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </PageContainer>
      <Box
        mb={['-350px', '-80px']}
        style={{ background: '#17192e', color: '#ffffff' }}
      >
        <StartBuilding
          style={{ transform: `translateY(-${_isMobile ? 60 : 50}%)` }}
        />
      </Box>
    </Box>
  )
}
