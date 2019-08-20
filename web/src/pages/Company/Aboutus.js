import React, { useState } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import LinkWithArrow from 'components/LinkWithArrow'
import FilledButton from 'components/FilledButton'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons'

import Sequoia from 'images/sequoia.svg'
import Dunamu from 'images/dunamu.svg'
import Seax from 'images/seax.png'
import BackgroundCompanySrc from 'images/background-company.png'
import media, { isMobile } from 'ui/media'

import CoinDeskSrc from 'images/featured/coindesk.png'
import YahooNewsSrc from 'images/featured/yahoo-news.png'
import TechInAsiaSrc from 'images/featured/tech-in-asia.png'
import E27Src from 'images/featured/e27.png'
import DealSrc from 'images/featured/deal.png'

import JumpstartSrc from 'images/featured/jumpstart.png'
import Linkedin from 'images/linkedin.svg'
import Git from 'images/github-logo.svg'
import Behance from 'images/behance-logo.svg'

import Man from 'images/team/man.png'
import Swit from 'images/team/swit.png'
import Paul from 'images/team/paul.png'
import Bun from 'images/team/bun.png'
import Peach from 'images/team/peach.png'
import Ming from 'images/team/ming.png'
import Q from 'images/team/q.png'
import Meen from 'images/team/meen.png'

const Featured = styled.a.attrs({
  target: '_blank',
})`
  padding: 0 10px 30px;
  display: block;
  transition: all 250ms;

  ${media.mobile} {
  }

  &:hover {
    transform: translateY(-5px);
  }
`

const TeamComponent = ({ faceImg, name, title, children, type, link }) => (
  <Flex
    width={['auto', '330px']}
    mt="15px"
    mb="35px"
    flexDirection="column"
    alignItems="center"
  >
    {faceImg ? (
      <Image src={faceImg} width="120px" height="120px" />
    ) : (
      <Flex
        bg="#d8d8d8"
        style={{ borderRadius: '50%', width: '120px', height: '120px' }}
      />
    )}
    <Flex my="10px" flexDirection="row">
      <Text fontWeight={600} fontSize={['16px', '20px']} color="#2a304e">
        {name}
      </Text>
      <Flex mx="5px" />
      <AbsoluteLink href={link}>
        <Image
          src={
            (type === 0 && Git) ||
            (type === 1 && Linkedin) ||
            (type === 2 && Behance)
          }
          width="20px"
          height="20px"
        />
      </AbsoluteLink>
    </Flex>
    <Text
      color="#4a4a4a"
      fontWeight={500}
      style={{ whiteSpace: 'nowrap' }}
      fontSize={['12px', '16px']}
    >
      {title}
    </Text>
    {children}
  </Flex>
)

export default () => {
  const _isMobile = isMobile()
  return (
    <Box style={{ overflow: 'hidden' }}>
      <Box
        style={{
          backgroundImage: 'linear-gradient(to bottom, #f0f4ff, #e7edff)',
        }}
      >
        <Box
          style={{
            backgroundImage: `url(${BackgroundCompanySrc})`,
            backgroundPosition: 'bottom',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <PageContainer>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              maxWidth="1380px"
              py={['30px', '90px']}
            >
              <Text
                textAlign="center"
                fontFamily="bio-sans"
                fontSize={['23px', '48px']}
                mb={['12px', '20px']}
                lineHeight={['27px', '80px']}
                fontWeight={900}
                color="#3b426b"
              >
                We Build Bridges between Blockchains and the Real World
              </Text>

              <Text
                textAlign="center"
                fontSize={['14px', '18px']}
                lineHeight={['20px', '36px']}
                color="#323232"
                mb="28px"
              >
                Band sets out to solve the issues plauging current generation of
                decentralized technologies. By establishing a standard framework
                for community to collectively curate data in trustless manner,
                we open up
              </Text>

              <FilledButton
                message="Connect with Our Team"
                arrow
                width="348px"
                style={{
                  backgroundImage:
                    'linear-gradient(to bottom, #2a3a7f, #1c2764)',
                }}
              />
            </Flex>
          </PageContainer>
        </Box>
      </Box>
      <Box mt={['20px', '-40px']}>
        <PageContainer>
          <Flex
            bg="#ffffff"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            py={['30px', '50px']}
            mb={['30px', '70px']}
            style={{
              minHeight: '160px',
              zIndex: '1',
              border: _isMobile ? 'none' : 'solid 1px #e3e3e3',
            }}
          >
            <Text fontSize={['20px', '20px']} fontWeight={600} color="#5569de">
              In Partnership With
            </Text>
            <Flex
              mt={['20px', '30px']}
              alignItems="center"
              flexDirection={['column', 'row']}
              style={{ width: 'calc(100vw - 40px)', maxWidth: '800px' }}
            >
              <Flex
                flex={1}
                justifyContent="center"
                my={['20px', '0px']}
                css={{
                  '&:hover': {
                    filter:
                      'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="https://www.sequoiacap.com/">
                  <Image
                    src={Sequoia}
                    height="20px"
                    style={{ filter: 'brightness(0.2)' }}
                  />
                </AbsoluteLink>
              </Flex>
              <Flex
                flex={1}
                justifyContent="center"
                my={['20px', '0px']}
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="http://www.dunamupartners.com/">
                  <Image
                    src={Dunamu}
                    height="20px"
                    style={{ filter: 'brightness(0.2)' }}
                  />
                </AbsoluteLink>
              </Flex>
              <Flex
                flex={1}
                my={['20px', '0px']}
                justifyContent="center"
                css={{
                  '&:hover': {
                    filter:
                      'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                  },
                }}
              >
                <AbsoluteLink href="https://www.linkedin.com/company/seax-ventures/">
                  <Image
                    src={Seax}
                    width="105px"
                    style={{ filter: 'brightness(0.2)' }}
                  />
                </AbsoluteLink>
              </Flex>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>
      <PageContainer>
        <Flex flexDirection={['column', 'row']}>
          <Flex
            flexDirection={'column'}
            alignItems="center"
            justifyContent="center"
            mr={['0px', '36px']}
            flex={1}
          >
            <Flex>
              <Text
                fontSize={['25px', '34px']}
                fontFamily="bio-sans"
                lineHeight={['80px']}
                fontWeight="bold"
                color="#3b426b"
              >
                Our Mission
              </Text>
            </Flex>
            <Flex bg="#f6f8ff" py="30px" px="25px">
              <Text
                fontSize={['14px', '18px']}
                lineHeight={['20px', '36px']}
                color="#323232"
              >
                Band is a protocol for decentralized data governance. We provide
                an open-source standard and framework for the decentralized
                management of data in the Web3 technology stack. Band Protocol
                solves the issues plaguing current data infrastructures and
                decentralized technologies as a whole. It is estimated that over
                1.2 million terabytes of data are stored on the web and
                currently much of this is unstructured or unreliable. Through a
                standard framework, Band creates a community-driven data
                curation ecosystem that is secure, reliable and accessible. Band
                provides a socially scalable method for widespread adoption and
                integration of trusted data that all applications can utilize.
              </Text>
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            flex={1}
            my={['10px', '0px']}
          >
            <Text
              fontSize={['25px', '34px']}
              fontFamily="bio-sans"
              lineHeight={['80px']}
              fontWeight="bold"
              color="#3b426b"
            >
              Featured In
            </Text>

            <Flex
              mx={['20px']}
              flex={1}
              flexDirection="column"
              bg="#f6f8ff"
              py={['15px', '30px']}
              px={['7px', '20px']}
            >
              <Flex
                flex={1}
                flexWrap="wrap"
                width={['calc(100vw - 40px)', 'auto']}
                justifyContent="center"
                mb={['0px', '40px']}
              >
                <Featured href="https://www.coindesk.com/sequoia-india-leads-3-million-round-for-token-startup-tackling-fake-news">
                  <Image height={['18px', '31px']} src={CoinDeskSrc} />
                </Featured>
                <Featured href="https://sg.news.yahoo.com/blockchain-based-information-curation-startup-band-protocol-secures-010013124.html">
                  <Image height={['26px', '32px']} src={YahooNewsSrc} />
                </Featured>
                <Featured href="https://e27.co/blockchain-based-information-curation-startup-band-protocol-secures-us3m-seed-funding-20190217/">
                  <Image height={['29px', '48px']} src={E27Src} />
                </Featured>
                <Featured href="https://www.dealstreetasia.com/stories/sequoia-india-band-protocol-121721/">
                  <Image src={DealSrc} />
                </Featured>
                <Featured href="https://www.techinasia.com/band-protocol-nets-3m-seed-funding-sequoia-india">
                  <Image height={['19px', '32px']} src={TechInAsiaSrc} />
                </Featured>
                <Featured href="https://jumpstartmag.com/blog/band-protocol-raises-us3-million-seed-funding-led-by-sequoia-india-to-give-power-back-to-internet">
                  <Image height={['24px', '40px']} src={JumpstartSrc} />
                </Featured>
              </Flex>
              <Flex>
                <a
                  style={{ display: 'block', margin: '0 auto' }}
                  target="_blank"
                  href="/media.zip"
                >
                  <Button
                    width="100%"
                    style={{
                      fontFamily: 'bio-sans',
                      fontWeight: 500,
                      backgroundImage:
                        'linear-gradient(to bottom, #8199ff, #6073de)',
                    }}
                  >
                    Download Media Kit
                    <FontAwesomeIcon
                      style={{ marginLeft: '10px' }}
                      icon={faCloudDownloadAlt}
                    />
                  </Button>
                </a>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </PageContainer>
      <Box mt={['40px', '95px']}>
        <PageContainer>
          <Flex justifyContent="center" alignItems="center">
            <Text
              color="#3b426b"
              fontFamily="bio-sans"
              fontWeight="bold"
              fontSize={['24px', '48px']}
              lineHeight={[1, 1.67]}
            >
              Our Team
            </Text>
          </Flex>

          <Flex
            flexWrap="wrap"
            flexDirection={['column', 'row']}
            mt={['20px', '40px']}
            justifyContent="center"
            px={['calc(50vw - 170px)', '0px']}
          >
            <TeamComponent
              faceImg={Man}
              name="Soravis Srinawakoon"
              title="CEO and Co-Founder"
              link={'https://www.linkedin.com/in/soravis-srinawakoon-91098259/'}
              type={1}
            >
              <Text
                mt="10px"
                fontSize={['12px', '14px']}
                textAlign="center"
                lineHeight={[1.3, 1.57]}
                fontWeight={300}
              >
                M.S. in MS&E, B.S. in CS <br />
                Stanford University
                <br /> Boston Consulting Group
              </Text>
            </TeamComponent>
            <TeamComponent
              faceImg={Swit}
              name="Sorawit Suriyakarn"
              title="CTO and Co-Founder"
              link={'https://www.linkedin.com/in/sorawit/'}
              type={1}
            >
              <Text
                mt="10px"
                fontSize={['12px', '14px']}
                textAlign="center"
                lineHeight={[1.3, 1.57]}
                fontWeight={300}
              >
                M.Eng./S.B. in EECS
                <br />
                Massachusetts Institute of Technology
                <br />
                Hudson River Trading, Quora, Dropbox
              </Text>
            </TeamComponent>
            <TeamComponent
              faceImg={Paul}
              name="Paul Nattapatsiri"
              title="CPO and Co-Founder"
              link={'https://github.com/smiled0g'}
              type={0}
            >
              <Text
                mt="10px"
                fontSize={['12px', '14px']}
                textAlign="center"
                lineHeight={[1.3, 1.57]}
                fontWeight={300}
              >
                Creator of Crypto Gaming Apps
                <br />
                with 800,000+ users
                <br />
                Tripadvisor, Turfmappx
              </Text>
            </TeamComponent>
            <TeamComponent
              faceImg={Bun}
              name="Bun Uthaitirat"
              title="Chief Fun Officer and Developer"
              link={'https://github.com/taobun'}
              type={0}
            />
            <TeamComponent
              faceImg={Peach}
              name="Kanisorn Thongprapaisaeng"
              title="Developer"
              link={'https://github.com/evilpeach'}
              type={0}
            />
            <TeamComponent
              faceImg={Q}
              name="Prin Rangsiruji"
              link={'https://github.com/prin-r'}
              title="Developer"
              type={0}
            />
            {_isMobile && <Flex my="15px" />}
            <TeamComponent
              faceImg={Meen}
              name="Atchanata Klunrit"
              title="Operation and legal office"
              link={'https://www.linkedin.com/in/atchanata-klunrit-05b3a9131/'}
              type={1}
            />
          </Flex>
        </PageContainer>
      </Box>
      <Box mt={['20px', '60px']} pb="60px">
        <Flex justifyContent="center">
          <FilledButton
            message="See Opening Positions"
            width={['348px', '435px']}
            arrow
            to="/company/career"
          />
        </Flex>
      </Box>
    </Box>
  )
}
