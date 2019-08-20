import React from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import { Link, Flex, Box, Image, Bold, Text, H4, AbsoluteLink } from 'ui/common'
import { isMobile } from 'ui/media'
import Subscribe from 'components/Subscribe'

import LogoSrc from 'images/logo.png'

import Reddit from 'images/reddit.svg'
import Telegram from 'images/telegram.svg'
import Medium from 'images/medium.svg'
import Twitter from 'images/twitter.svg'

const Container = styled(Box)`
  background: #344498;
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
        '&:hover': {
          filter: 'sepia(1) brightness(0.9) saturate(10) hue-rotate(176deg)',
        },
      }}
    >
      <Box mx={1}>
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
          pt={['20px', '50px']}
          pb={['0px', '70px']}
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
                Features
              </H4>
              <Box mb={[3, '20px']}>
                <Link to="/features/overview">
                  <Text fontSize="14px">Product Overview</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/features/dual-token">
                  <Text fontSize="14px">Dual-Token Economics</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/features/tcd">
                  <Text fontSize="14px">Token-Curated DataSources</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/features/data-governance-portal">
                  <Text fontSize="14px">Data Governance Portal</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/developer">
                  <Text fontSize="14px">For Developers</Text>
                </Link>
              </Box>
            </Box>
          </Flex>
          <Flex flex={[1, '0 0 150px']} ml={['0px', '64px']}>
            <Box>
              <H4 mb={['10px', '30px']} py={['30px', 1]}>
                Company
              </H4>
              <Box mb={[3, '20px']}>
                <Link to="/company/about-us">
                  <Text fontSize="14px">Overview</Text>
                </Link>
              </Box>
              <Box mb={[3, '20px']}>
                <Link to="/company/career">
                  <Text fontSize="14px">Career with Band</Text>
                </Link>
              </Box>
            </Box>
          </Flex>
          <Flex flex={[1, '0 0 150px']} ml={['0px', '64px']}>
            <Box>
              <H4 mb={['10px', '30px']} py={['30px', 1]}>
                Join Community
              </H4>
              <Flex
                ml={['-5px', '-5px']}
                mt={['30px', '0px']}
                mb={['10px', '21px']}
                justifyContent={['center', 'flex-start']}
              >
                <SmallIcon
                  href="https://www.reddit.com/r/bandprotocol"
                  src={Reddit}
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
              </Flex>
              <Box mb={[3, '20px']}>
                <AbsoluteLink
                  target="_blank"
                  href="https://forum.bandprotocol.com"
                >
                  <Text fontSize="14px">Developer Forum</Text>
                </AbsoluteLink>
              </Box>
              <Box mb={[3, '20px']}>
                <AbsoluteLink
                  target="_blank"
                  href="https://medium.com/bandprotocol"
                >
                  <Text fontSize="14px">Blog</Text>
                </AbsoluteLink>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </PageContainer>
      {/* <PageContainer>
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
            <SmallIcon
              href="https://www.reddit.com/r/bandprotocol"
              src={Reddit}
              ml="12px"
              bg
            />
          </Flex>
        </Flex>
      </PageContainer> */}
    </Container>
  )
}
