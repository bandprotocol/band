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
              Band Web3 Wallet
            </H1>
          </Box>
          <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
            A all-in-one wallet for any function you may want to carry out in
            the Band ecosystem.
          </Text>
          <Image src={WalletSrc} my={5} height="280px" />
          <Card bg="#f0f2ff" pt={4} pb={5} px="42px" width="780px">
            <Text textAlign="center" fontSize={2} lineHeight={1.94} mb={4}>
              The Band Web 3 wallet is especially designed to support a diverse
              array of dApps and functionalities. Users can store the tokens
              they receive in these wallets and use them for transactions
              occurring throughout the network. All of this is done with a
              user-centric design that provides high levels of security and
              multi-platform support.
            </Text>
            <Flex justifyContent="center">
              <Button
                variant="outline"
                style={{ color: '#545454', width: '200px' }}
              >
                Demo
              </Button>
              <Button
                variant="primary"
                ml={5}
                style={{ width: '240px', padding: '0px' }}
              >
                Integrate Band Web3 Wallet
              </Button>
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
