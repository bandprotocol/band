import React from 'react'
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

import StartBuilding from 'components/StartBuilding'

import WhyBand from 'images/whyband.png'
import LayersImg from 'images/layers.png'
import SDAImg from 'images/solve-data-availability.svg'
import SDRImg from 'images/solve-data-reliability.svg'

const WithDotLeft = ({ text }) => (
  <Flex flexDirection="row" style={{ lineHeight: 1.94 }}>
    <Text color="#ffca55" mr="10px" lineHeight={1.94}>
      •
    </Text>
    <Text lineHeight={2.25}>{text}</Text>
  </Flex>
)

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
            width={['calc(100vw - 40px)', '780px']}
            fontSize={['16px', '18px']}
            lineHeight={[1.63, 1.94]}
          >
            Availability and reliability are the two main problems when
            incorporating data into any decentralized application. Band Protocol
            solves this problem by using crypto-economic incentives structures
            to ensure data accuracy, while utilizing the open nature of
            blockchains to distribute data in a fair and transparent manner.
          </Text>
          <Image
            src={WhyBand}
            my={['30px', '70px']}
            width={['calc(100vw - 40px)', '780px']}
          />
          <Card
            bg="#f6f8ff"
            pt={4}
            pb={['30px', '50px']}
            px={['20px', '65px']}
            width={['calc(100vw - 40px)', '780px']}
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
              layer by providing reliable data for applications that require
              <br />
              <br />
              <Flex flexDirection={['column', 'row']}>
                <Flex flexDirection="column" flex={1}>
                  <WithDotLeft text=" Off-chain oracles" />
                  <WithDotLeft text="Identity management" />
                  <WithDotLeft text="KYC / AML" />
                  <WithDotLeft text="Ranking" />
                  <WithDotLeft text="Data source for smart contracts" />
                </Flex>
                <Flex
                  mt={['30px', '0px']}
                  flex={1}
                  justifyContent={['center', 'flex-end']}
                >
                  <Image src={LayersImg} height={['200px', '200px']} />
                </Flex>
              </Flex>
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
            <Flex
              flex={1}
              flexDirection="column"
              alignItems={['center', 'flex-start']}
            >
              <Image src={SDAImg} width="100px" />
              <Text my="20px" fontSize="24px">
                Data Availability
              </Text>
              <Text
                lineHeight={1.5}
                width={['calc(100vw - 80px)', 'auto']}
                textAlign={['center', 'left']}
              >
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
              alignItems={['center', 'flex-start']}
            >
              <Image src={SDRImg} width="100px" />
              <Text my="20px" fontSize="24px">
                Data Reliability
              </Text>
              <Text
                lineHeight={1.5}
                width={['calc(100vw - 80px)', 'auto']}
                textAlign={['center', 'left']}
              >
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
