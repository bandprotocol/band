import React from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import {
  Link,
  Flex,
  Box,
  Image,
  Bold,
  Text,
  H4,
  SemiBold,
  AbsoluteLink,
} from 'ui/common'
import { colors } from 'ui'
import { isMobile } from 'ui/media'
import Subscribe from 'components/Subscribe'

import LogoSrc from 'images/logo.svg'

import Reddit from 'images/reddit.svg'
import Telegram from 'images/telegram.svg'
import Medium from 'images/medium.svg'
import Twitter from 'images/twitter.svg'

const Container = styled(Box)`
  background: #17192e;
  color: #ffffff;

  a {
    color: #ffffff;

    &:hover {
      color: #bfcdff;
    }
  }
`

const SmallIcon = ({ ml, href, src }) => (
  <Flex ml={ml} alignItems="center" justifyContent="center">
    <AbsoluteLink
      href={href}
      css={{
        transition: 'all 0.2s',
        '&:hover': {
          filter: 'sepia(1) brightness(0.9) saturate(10) hue-rotate(176deg)',
        },
      }}
    >
      <Box mx={2}>
        <Image src={src} width="26px" />
      </Box>
    </AbsoluteLink>
  </Flex>
)
export default () => {
  const _isMobile = isMobile()
  return (
    <Container>
      <PageContainer>
        <Flex
          mb="45px"
          pt={['20px', '50px']}
          flexWrap="wrap"
          flexDirection={['column', 'row']}
        >
          <Box width="270px">
            <Flex alignItems="center" mb={['20px', 4]}>
              <Image src={LogoSrc} height={32} mr={3} />
            </Flex>
            <Text lineHeight={2.4} fontSize={14}>
              Portcullis Chambers, 4th Floor Ellen Skelton Building, 3076 Sir
              Francis Drake Highway, Road Town, Tortola, British Virgin Islands
              VG1110
            </Text>
          </Box>
          <Flex flex={[1, '0 0 200px']} ml={['0px', 'auto']}>
            <Box>
              <H4 mb={['10px', '30px']} py={['30px', 1]}>
                Products
              </H4>
              <Box mb={[3, '20px']}>
                <Link to="/products/data-tokenization">
                  <Text fontSize="14px">Data Tokenization</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/products/tcd">
                  <Text fontSize="14px">Token Curated DataSource</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/products/tcr">
                  <Text fontSize="14px">Token Curated Registries</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/products/wallet">
                  <Text fontSize="14px">Band Web3 Wallet</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/products/private-sharing">
                  <Text fontSize="14px">Private Data Sharing</Text>
                </Link>
              </Box>
            </Box>
          </Flex>
          <Flex flex={[1, '0 0 150px']} ml={['0px', '64px']}>
            <Box>
              <H4 mb={['10px', '30px']} py={['30px', 1]}>
                Explores
              </H4>
              <Box mb={[3, '20px']}>
                <AbsoluteLink
                  target="_blank"
                  href="https://app-wip.rinkeby.bandprotocol.com"
                >
                  <Text fontSize="14px">Governance Portal</Text>
                </AbsoluteLink>
              </Box>
              <Box mb={[3, '20px']}>
                <AbsoluteLink
                  target="_blank"
                  href="https://data.bandprotocol.com"
                >
                  <Text fontSize="14px">Dataset Explorer</Text>
                </AbsoluteLink>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </PageContainer>
      <PageContainer>
        <Flex
          alignItems={['left', 'center']}
          style={{ borderTop: 'solid 1px #8d94bf' }}
          flexDirection={['column', 'row']}
          py="40px"
        >
          <Text pl={[0, 2]} pr={4} mb={['20px', 0]}>
            Subscribe for updates
          </Text>
          <Box style={{ maxWidth: 280 }}>
            <Subscribe />
          </Box>
          <Flex
            ml={['0px', 'auto']}
            mt={['30px', '0px']}
            justifyContent={['center', 'flex-end']}
          >
            <SmallIcon
              href="https://www.reddit.com/r/bandprotocol"
              src={Reddit}
              ml="12px"
              bg
            />
            <SmallIcon
              href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ"
              src={Telegram}
              ml="12px"
              bg
            />
            <SmallIcon
              href="https://medium.com/bandprotocol"
              src={Medium}
              ml="12px"
              bg
            />
            <SmallIcon
              href="https://twitter.com/bandprotocol"
              src={Twitter}
              ml="12px"
              bg
            />
            {/* <SmallIcon to="/" icon="fab fa-facebook-square fa-fw" />
                <SmallIcon to="/" ml="10px" icon="fab fa-linkedin fa-fw" />
                <SmallIcon
                  to="/"
                  ml="10px"
                  icon="fab fa-twitter-square fa-fw"
                />
                <SmallIcon to="/" ml="12px" icon="fab fa-instagram fa-fw" bg /> */}
          </Flex>
        </Flex>
      </PageContainer>
    </Container>
  )
}
