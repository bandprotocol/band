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
import PrivateDataSrc from 'images/privateData.svg'
import WalletIntegrate from 'images/band-wallet-integrate.svg'

import SSExample1 from 'images/SSExample1.png'

export default () => {
  const _isMobile = isMobile()
  return (
    <Box>
      <PageContainer>
        <Flex
          flexDirection="column"
          alignItems="center"
          mb={['430px', '180px']}
        >
          <Box mt={[4, 5]} mb={2}>
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              Private Data Sharing
            </Text>
          </Box>
          <Text
            textAlign={['left', 'center']}
            width={['calc(100vw - 40px)', '860px']}
            fontSize={['16px', '18px']}
            lineHeight={[1.63, 1.94]}
          >
            Band Protocol not only provides state-of-the-art open data
            management on the blockchain, but it also facilitates private data
            sharing for businesses that require data privacy.
          </Text>
          {
            <Image
              src={PrivateDataSrc}
              my={['30px', '70px']}
              width={['calc(100vw - 40px)', '620px']}
            />
          }
          <Card
            bg="#fafafa"
            pt={4}
            pb={['30px', 4]}
            px="42px"
            width={['calc(100vw - 40px)', '940px']}
          >
            <Text
              textAlign={['left', 'center']}
              color="#4c4c4c"
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Band Protocol provides a platform for businesses to share and
              monetize data off-chain by publishing the proof on-chain. The
              businesses can sell a chunk of data, and allow the transacting
              parties to verify integrity and correctness of data via the public
              proof. This design allows scalable and secure exchange of data
              without revealing sensitive information to the public.
            </Text>
            <Flex justifyContent="center" mt={[3, 4]}>
              <AbsoluteLink
                target="_self"
                href="mailto:connect@bandprotocol.com"
              >
                <Button variant="primary">Contact Us</Button>
              </AbsoluteLink>
            </Flex>
          </Card>
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
