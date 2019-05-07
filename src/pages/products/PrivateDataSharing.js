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

import FeatureCard from 'components/FeatureCard'
import StartBuilding from 'components/StartBuilding'
import CoinHatcherShowcase from 'components/CoinHatcherShowcase'

import WalletSrc from 'images/walletExample.svg'
import WalletIntegrate from 'images/band-wallet-integrate.svg'

import SSExample1 from 'images/SSExample1.png'

export default () => {
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={5} mb={3}>
            <H1 textAlign="center" dark>
              Private Data Sharing
            </H1>
          </Box>
          <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
            Band Protocol not only provides state-of-the-art open data
            management on the blockchain, but it also facilitates private data
            sharing for businesses that require data privacy.
          </Text>
          <Image src={WalletSrc} my={5} height="280px" />
          <Card bg="#f0f2ff" pt={4} pb={4} px="42px" width="780px">
            <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
              Band Protocol provides a platform for businesses to share and
              monetize data off-chain by publishing the proof on-chain. The
              businesses can sell a chunk of data, and allow the transacting
              parties to verify integrity and correctness of data via the public
              proof. This design allows scalable and secure exchange of data
              without revealing sensitive information to the public.
            </Text>
            <Flex justifyContent="center">
              <Button variant="primary">Contact Us</Button>
            </Flex>
          </Card>
        </Flex>
        <Flex flexDirection="column" alignItems="center" mb={5} mt={5}>
          <Box mb={2}>
            <H1 textAlign="center" dark>
              How to Integrate Band Wallet
            </H1>
          </Box>
          <Image src={WalletIntegrate} my={4} />
        </Flex>
        <Flex
          width={1}
          flexDirection="column"
          alignItems="center"
          style={{ borderTop: '1px solid #e2e2e2' }}
        >
          <Box mt={5} mb={3}>
            <H1 textAlign="center" dark>
              Security
            </H1>
          </Box>
          <Text>
            Band provides unmatched security to ensure constant data integrity
            and user-centric privacy
          </Text>
          <Flex my="50px" />
          <Card bg="#f0f2ff" py="50px" px="42px" width="780px">
            <Text textAlign="center" fontSize={2} lineHeight={1.94}>
              Band is keenly focused on ensuring that all data on the platform
              is trusted and reliable. As a result, we equip our data curation
              infrastructure with proper incentive mechanisms to avoid any large
              scale security attacks or threats. In addition, we properly create
              a system that is able to protect against typical inadequacies
              faced by oracles.
            </Text>
          </Card>
        </Flex>
        <Flex mb="100px" />
      </PageContainer>
      <Box bg="#f0f2ff" style={{ height: 180 }} />
      <Box mb="-80px" style={{ background: '#17192e', color: '#ffffff' }}>
        <StartBuilding style={{ transform: 'translateY(-50%)' }} />
      </Box>
    </Box>
  )
}
