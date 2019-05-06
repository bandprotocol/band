import React from 'react'
import styled from 'styled-components'
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

const SmallIcon = ({ ml, href, icon, bg }) => (
  <Flex ml={ml} alignItems="center" justifyContent="center">
    <AbsoluteLink href={href}>
      <Box
        bg={bg && colors.purple.normal}
        style={{
          borderRadius: '5px',
        }}
        py="3px"
      >
        {bg ? (
          <Text fontSize={15} color="#ffffff" px={1}>
            <i className={icon} />
          </Text>
        ) : (
          <Text fontSize={21}>
            <i className={icon} />
          </Text>
        )}
      </Box>
    </AbsoluteLink>
  </Flex>
)
export default class FooterBar extends React.Component {
  render() {
    return (
      <Container>
        <PageContainer>
          <Flex mb="45px" pt="50px" flexWrap="wrap">
            <Box width={[1 / 2, '270px']}>
              <Flex alignItems="center" mb={4}>
                <Image src={LogoSrc} height={32} mr={3} />
              </Flex>
              <Text lineHeight={2.4} fontSize={14}>
                Portcullis Chambers, 4th Floor Ellen Skelton Building, 3076 Sir
                Francis Drake Highway, Road Town, Tortola, British Virgin
                Islands VG1110
              </Text>
            </Box>
            <Flex flex={[1, '0 0 200px']} ml={['20px', 'auto']}>
              <Box>
                <H4 mb={['22px', '30px']} py={1}>
                  Products
                </H4>
                <Box mb={[3, '20px']}>
                  <Link to="/product/tokenization">
                    <Text fontSize="14px">Data Tokenization</Text>
                  </Link>
                </Box>
                <Box mb={[3, '20px']}>
                  <Link to="/product/tcd">
                    <Text fontSize="14px">Token Curated DataSource</Text>
                  </Link>
                </Box>
                <Box mb={[3, '20px']}>
                  <Link to="/product/tcr">
                    <Text fontSize="14px">Token Curated Registries</Text>
                  </Link>
                </Box>
                <Box mb={[3, '20px']}>
                  <Link to="/product/wallet">
                    <Text fontSize="14px">Band Web3 Wallet</Text>
                  </Link>
                </Box>
                <Box mb={[3, '20px']}>
                  <Link to="/product/private-sharing">
                    <Text fontSize="14px">Private Data Sharing</Text>
                  </Link>
                </Box>
              </Box>
            </Flex>
            <Flex flex={[1, '0 0 200px']} ml={['20px', '64px']}>
              <Box>
                <H4 mb={['22px', '30px']} py={1}>
                  Products
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
            alignItems="center"
            style={{ borderTop: 'solid 1px #8d94bf', height: 60 }}
          >
            <Text pl={2} pr={4}>
              Subscribe for updates
            </Text>
            <Box style={{ maxWidth: 280 }}>
              <Subscribe />
            </Box>
            <Flex ml="auto">
              <SmallIcon
                href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ"
                icon="fab fa-telegram-plane"
                ml="12px"
                bg
              />
              <SmallIcon
                href="https://medium.com/bandprotocol"
                icon="fab fa-medium-m"
                ml="12px"
                bg
              />
              <SmallIcon
                href="https://twitter.com/bandprotocol"
                icon="fab fa-twitter"
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
}
