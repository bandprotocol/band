import React, { useState } from 'react'
import styled from 'styled-components/macro'
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
import media, { isMobile } from 'ui/media'

import StartBuilding from 'components/StartBuilding'

import CompanySrc from 'images/company.svg'

import CoinDeskSrc from 'images/featured/coindesk.png'
import YahooNewsSrc from 'images/featured/yahoo-news.png'
import TechInAsiaSrc from 'images/featured/tech-in-asia.png'
import E27Src from 'images/featured/e27.png'
import DealSrc from 'images/featured/deal.png'

import JumpstartSrc from 'images/featured/jumpstart.png'
import Linkedin from 'images/linkedin.svg'
import Git from 'images/github-logo.svg'
import Behance from 'images/behance-logo.svg'
import WeRHiring from 'images/we-re-hiring.svg'

import Sequoia from 'images/sequoiaGray.svg'
import Dunamu from 'images/dunamuGray.svg'
import Seax from 'images/seaxGray.png'
import Reddit from 'images/redditGray.svg'
import Telegram from 'images/telegramGray.svg'
import Medium from 'images/mediumGray.svg'
import Twitter from 'images/twitterGray.svg'

import Man from 'images/team/man.png'
import Swit from 'images/team/swit.png'
import Paul from 'images/team/paul.png'
import Bun from 'images/team/bun.png'
import Peach from 'images/team/peach.png'
import Ming from 'images/team/ming.png'

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

const ApplyButton = styled(Button)`
  width: 135px;
  height: 45px;
  border-radius: 22.5px;
  border: solid 1px #6b8bf5;
  box-shadow: ${props =>
    props.isSelected ? '0 8px 17px 0 rgba(191, 191, 191, 0.5)' : 'none'};
  background-color: ${props => (props.isSelected ? '#6b8bf5' : '#ffffff')};
  color: ${props => (props.isSelected ? 'white' : '#4a4a4a')};
  font-size: 18px;
  font-weight: 300;
  transition: all 0.5s;
`

const TeamComponent = ({ faceImg, name, title, type, link }) => (
  <Flex flex={1} flexDirection="column" alignItems="center">
    {faceImg ? (
      <Image src={faceImg} width="120px" height="120px" />
    ) : (
      <Flex
        bg="#d8d8d8"
        style={{ borderRadius: '50%', width: '120px', height: '120px' }}
      />
    )}
    <Flex my="10px" flexDirection="row">
      <Text fontSize="20px" color="#2a304e">
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
    <Text color="#4a4a4a" fontWeight={300} fontSize="16px">
      {title}
    </Text>
  </Flex>
)

const JobTab = ({ title, description, setSelectedTab, isSelected }) => (
  <Flex
    bg="white"
    flexDirection="column"
    p="30px"
    style={{
      width: '290px',
      height: '260px',
      borderRadius: '4px',
      border: isSelected ? 'solid 1px #6b8bf5' : 'solid 1px #abbbff',
      boxShadow: isSelected ? '0 20px 29px 0 rgba(216, 216, 216, 0.5)' : 'none',
      transform: isSelected ? 'scale(1.05)' : 'none',
      transition: 'all 0.5s',
      zIndex: 1,
    }}
    onMouseOver={setSelectedTab}
  >
    <Flex>
      <Text color="#2a304e" fontSize="30px" lineHeight={1.17} fontWeight={900}>
        {title}
      </Text>
    </Flex>
    <Flex mt="15px" mb="50px">
      <Text fontSize="16px" color="#4a4a4a">
        {description}
      </Text>
    </Flex>
    <ApplyButton isSelected={isSelected}>Apply</ApplyButton>
  </Flex>
)

const JobTabs = () => {
  const [selectedTab, setSelectedTab] = useState(-1)
  return (
    <Flex
      flexDirection={['column', 'row']}
      onMouseLeave={() => setSelectedTab(-1)}
    >
      <JobTab
        title="Mobile
    App Engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 0}
        setSelectedTab={() => setSelectedTab(0)}
      />
      <Flex mx={['0px', '15px']} my={['15px', '0px']} />
      <JobTab
        title="Frontend
        Engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 1}
        setSelectedTab={() => setSelectedTab(1)}
      />
      <Flex mx={['0px', '15px']} my={['15px', '0px']} />
      <JobTab
        title="Backend
        Engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 2}
        setSelectedTab={() => setSelectedTab(2)}
      />
    </Flex>
  )
}

export default () => {
  const _isMobile = isMobile()
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={[4, 5]} mb={2}>
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              Company
            </Text>
          </Box>
          <Text
            textAlign={['left', 'center']}
            width={['calc(100vw - 40px)', '780px']}
            fontSize={['16px', '18px']}
            lineHeight={[1.63, 1.94]}
          >
            Band Protocol is a protocol for decentralized data governance. We
            provide open-source standard and framework for the decentralized
            management of data.
          </Text>
          <Image src={CompanySrc} my={[4, 5]} />
          <Card
            bg="#f6f8ff"
            px="45px"
            py="25px"
            width={['calc(100vw - 40px)', '940px']}
          >
            <Text
              textAlign={['left', 'center']}
              color="#4c4c4c"
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Band Protocol was created to solve the issues plaguing current
              data infrastructures and decentralized technologies as a whole. It
              is estimated that over 1.2 million terabytes of data is stored on
              the web and currently much of this is unstructured data or
              unreliable data.
              <br />
              <br />
              Band Protocol is a component layer solution for managing data in
              the Web3 technology stack. With the use of an innovative token
              framework and standardized data protocols, Band is able to create
              a community-driven data curation ecosystem that is secure,
              reliable and accessible.
              <br />
              <br />
              Through the use of a standard framework, Band is able to provide a
              socially scalable method for widespread adoption and integration
              of trusted data that all dApps can utilize.
            </Text>
          </Card>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          pt={['30px', '60px']}
          mt={['30px', '60px']}
          mx={['0px', '-40px']}
          style={{
            borderTop: 'solid 1px #e2e2e2',
            borderBottom: 'solid 1px #e2e2e2',
          }}
        >
          <Box mb={3}>
            <H1 textAlign="center" dark>
              <Text
                color="#2a304e"
                fontSize={['24px', '38px']}
                lineHeight={[1, 1.5]}
              >
                Featured In
              </Text>
            </H1>
          </Box>
          <Flex
            alignItems="center"
            flexWrap="wrap"
            width={['calc(100vw - 40px)', 'auto']}
            justifyContent="center"
            mb={['0px', '40px']}
          >
            <Featured href="https://www.dealstreetasia.com/stories/sequoia-india-band-protocol-121721/">
              <Image height={['39px', '65px']} src={DealSrc} />
            </Featured>
            <Featured href="https://sg.news.yahoo.com/blockchain-based-information-curation-startup-band-protocol-secures-010013124.html">
              <Image height={['26px', '32px']} src={YahooNewsSrc} />
            </Featured>
            <Featured href="https://www.coindesk.com/sequoia-india-leads-3-million-round-for-token-startup-tackling-fake-news">
              <Image height={['18px', '31px']} src={CoinDeskSrc} />
            </Featured>
            <Featured href="https://jumpstartmag.com/blog/band-protocol-raises-us3-million-seed-funding-led-by-sequoia-india-to-give-power-back-to-internet">
              <Image height={['24px', '40px']} src={JumpstartSrc} />
            </Featured>
            <Featured href="https://www.techinasia.com/band-protocol-nets-3m-seed-funding-sequoia-india">
              <Image height={['19px', '32px']} src={TechInAsiaSrc} />
            </Featured>
            <Featured href="https://e27.co/blockchain-based-information-curation-startup-band-protocol-secures-us3m-seed-funding-20190217/">
              <Image height={['29px', '48px']} src={E27Src} />
            </Featured>
          </Flex>
        </Flex>
        <Box mt="35px">
          <H1 textAlign="center" dark>
            <Text
              color="#2a304e"
              fontSize={['24px', '38px']}
              lineHeight={[1, 1.5]}
            >
              Team & Advisors
            </Text>
          </H1>
          <Flex flexDirection={['column', 'row']} mt={['30px', '50px']}>
            <TeamComponent
              faceImg={Man}
              name="Soravis Srinawakoon"
              title="CEO and Co-Founder"
              link={'https://www.linkedin.com/in/soravis-srinawakoon-91098259/'}
              type={1}
            />
            {_isMobile && <Flex my="15px" />}
            <TeamComponent
              faceImg={Swit}
              name="Soravis Srinawakoon"
              title="CTO and Co-Founder"
              link={'https://www.linkedin.com/in/sorawit/'}
              type={1}
            />
            {_isMobile && <Flex my="15px" />}
            <TeamComponent
              faceImg={Paul}
              name="Paul Chonpimai"
              title="CPO and Co-Founder"
              link={'https://github.com/smiled0g'}
              type={0}
            />
          </Flex>
          <Flex flexDirection={['column', 'row']} mt={['30px', '50px']}>
            <TeamComponent
              faceImg={Bun}
              name="Bun Uthaitirat"
              title="Chief Fun Officer and Developer"
              link={'https://github.com/taobun'}
              type={0}
            />
            {_isMobile && <Flex my="15px" />}
            <TeamComponent
              faceImg={Peach}
              name="Kanisorn Thongprapaisaenh"
              title="Developer"
              link={'https://github.com/evilpeach'}
              type={0}
            />
            {_isMobile && <Flex my="15px" />}
            <TeamComponent
              faceImg={Ming}
              name="Subongkoch Maneerat"
              title="UX/UI Designer"
              link={'https://www.behance.net/minggnim'}
              type={2}
            />
          </Flex>
          {false && (
            <Flex flexDirection={['column', 'row']} mt={['30px', '50px']}>
              <TeamComponent
                name="Prin Rangsiruji"
                link={'https://github.com/prin-r'}
                title="Developer"
                type={0}
              />
              {_isMobile && <Flex my="15px" />}
              <TeamComponent
                name="Atchanata Klunrit"
                title="Operation and legal office"
                link={
                  'https://www.linkedin.com/in/atchanata-klunrit-05b3a9131/'
                }
                type={1}
              />
              <Flex flex={1} />
            </Flex>
          )}
        </Box>
      </PageContainer>
      <Box bg="#f6f8ff" mt="60px" pb="60px">
        <H1 textAlign="center" dark pt={['30px', '50px']}>
          <Text
            color="#2a304e"
            fontSize={['24px', '38px']}
            lineHeight={[1, 1.5]}
          >
            We're Hiring!
          </Text>
        </H1>
        <Flex
          width={1}
          justifyContent="center"
          style={{ position: 'relative' }}
        >
          {!_isMobile && (
            <Image
              src={WeRHiring}
              width="900px"
              style={{ position: 'absolute', zIndex: 0 }}
            />
          )}
          <Flex mt={['30px', '55px']}>
            <JobTabs />
          </Flex>
        </Flex>
        <PageContainer />
      </Box>
      <Box>
        <Flex justifyContent="center" mt={['30px', '60px']}>
          <Text
            fontSize={['24px', '38px']}
            lineHeight={[1, 1.5]}
            color="#2a304e"
            fontWeight="900"
          >
            Our Partners
          </Text>
        </Flex>
        <Flex
          mt={['25px', '45px']}
          flexDirection={['column', 'row']}
          justifyContent="center"
        >
          <Flex
            bg="rgba(0,0,0,0)"
            flexDirection="column"
            style={{
              width: ['auto', '425px'],
              height: '325px',
            }}
            pl="40px"
          >
            <Flex>
              <Text fontSize="22px" fontWeight={600} color="#4a4a4a">
                Partnerships Featuring
              </Text>
            </Flex>
            <Flex mt="40px">
              <AbsoluteLink
                href="https://www.sequoiacap.com/"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Sequoia} width="148px" />
              </AbsoluteLink>
            </Flex>
            <Flex mt="35px">
              <AbsoluteLink
                href="http://www.dunamupartners.com/"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Dunamu} width="245px" />
              </AbsoluteLink>
            </Flex>
            <Flex mt="35px">
              <AbsoluteLink
                href="https://www.linkedin.com/company/seax-ventures/"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Seax} width="105px" height="45px" />
              </AbsoluteLink>
            </Flex>
          </Flex>
          {_isMobile && <Flex mx="18px" />}
          <Flex
            bg="rgba(0,0,0,0)"
            flexDirection="column"
            px="40px"
            style={{
              width: ['auto', '425px'],
              height: '325px',
            }}
          >
            <Flex mt={['-60px', '0px']}>
              <Text fontSize="22px" fontWeight={600} color="#4a4a4a">
                Join Band Protocol {_isMobile && <br />} Community
              </Text>
            </Flex>
            <AbsoluteLink href="https://www.reddit.com/r/bandprotocol">
              <Flex
                fontSize="18px"
                mt="40px"
                alignItems="center"
                color="#7c84a6"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Reddit} width="30px" />
                <Flex mx="20px" />
                Reddit
                <Flex mx="20px" />
              </Flex>
            </AbsoluteLink>
            <AbsoluteLink href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ">
              <Flex
                fontSize="18px"
                mt="35px"
                alignItems="center"
                color="#7c84a6"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Telegram} width="30px" />
                <Flex mx="20px" />
                Telegram
              </Flex>
            </AbsoluteLink>
            <AbsoluteLink href="https://medium.com/bandprotocol">
              <Flex
                fontSize="18px"
                mt="35px"
                alignItems="center"
                color="#7c84a6"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Medium} width="30px" />
                <Flex mx="20px" />
                Medium
              </Flex>
            </AbsoluteLink>
            <AbsoluteLink href="https://twitter.com/bandprotocol">
              <Flex
                fontSize="18px"
                mt="35px"
                alignItems="center"
                color="#7c84a6"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Twitter} width="30px" />
                <Flex mx="20px" />
                Twitter
              </Flex>
            </AbsoluteLink>
          </Flex>
        </Flex>
      </Box>
      <Box
        mt={['350px', '150px']}
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
