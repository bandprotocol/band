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
  cursor: pointer;
  &:focus {
    outline: none;
  }
`

const TeamComponent = ({ faceImg, name, title, children, type, link }) => (
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
      <Text fontWeight={600} fontSize="20px" color="#2a304e">
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
      fontSize="16px"
    >
      {title}
    </Text>
    {children}
  </Flex>
)

const JobTab = ({ title, link, description, setSelectedTab, isSelected }) => (
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
    <AbsoluteLink href={link} style={{ width: '135px', cursor: 'pointer' }}>
      <ApplyButton isSelected={isSelected}>Apply</ApplyButton>
    </AbsoluteLink>
  </Flex>
)

const JobTabs = () => {
  const [selectedTab, setSelectedTab] = useState(-1)
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      onMouseLeave={() => setSelectedTab(-1)}
    >
      <JobTab
        title="Mobile
    App Engineer"
        link="https://angel.co/company/bandprotocol/jobs/435214-mobile-app-engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 0}
        setSelectedTab={() => setSelectedTab(0)}
      />
      <Flex mx={['0px', '15px']} my={['15px', '15px', '0px']} />
      <JobTab
        title="Frontend
        Engineer"
        link="https://angel.co/company/bandprotocol/jobs/435215-frontend-engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 1}
        setSelectedTab={() => setSelectedTab(1)}
      />
      <Flex mx={['0px', '15px']} my={['15px', '15px', '0px']} />
      <JobTab
        title="Backend
        Engineer"
        link="https://angel.co/company/bandprotocol/jobs/435216-backend-engineer"
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
          <Box mt={[4, 5]} mb="24px">
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              Company
            </Text>
          </Box>
          <Card
            bg="#f6f8ff"
            px={['15px', '45px']}
            py={['30px', '45px']}
            width="800px"
            style={{ maxWidth: 'calc(100vw - 40px)' }}
          >
            <Text
              textAlign="left"
              color="#4c4c4c"
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Band Protocol is a protocol for decentralized data governance. We
              provide an open-source standard and framework for the
              decentralized management of data in the Web3 technology stack.
              <br />
              <br />
              Band Protocol solves the issues plaguing current data
              infrastructures and decentralized technologies as a whole. It is
              estimated that over 1.2 million terabytes of data are stored on
              the web and currently much of this is unstructured or unreliable.
              <br />
              <br />
              Through a standard framework, Band creates a community-driven data
              curation ecosystem that is secure, reliable and accessible. Band
              provides a socially scalable method for widespread adoption and
              integration of trusted data that all applications can utilize.
            </Text>
          </Card>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          pt={['30px', '60px']}
          mt={['30px', '60px']}
          mx={['0px', '20px', '-40px']}
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
              <Image height={['39px', '65px']} src={DealSrc} />
            </Featured>
            <Featured href="https://www.techinasia.com/band-protocol-nets-3m-seed-funding-sequoia-india">
              <Image height={['19px', '32px']} src={TechInAsiaSrc} />
            </Featured>
            <Featured href="https://jumpstartmag.com/blog/band-protocol-raises-us3-million-seed-funding-led-by-sequoia-india-to-give-power-back-to-internet">
              <Image height={['24px', '40px']} src={JumpstartSrc} />
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
              Team
            </Text>
          </H1>
          <Flex flexDirection={['column', 'row']} mt={['30px', '50px']}>
            <TeamComponent
              faceImg={Man}
              name="Soravis Srinawakoon"
              title="CEO and Co-Founder"
              link={'https://www.linkedin.com/in/soravis-srinawakoon-91098259/'}
              type={1}
            >
              <Text
                mt="10px"
                fontSize="14px"
                textAlign="center"
                lineHeight={1.57}
                fontWeight={300}
              >
                M.S. in MS&E, B.S. in CS <br />
                Stanford University
                <br /> Boston Consulting Group
              </Text>
            </TeamComponent>
            {_isMobile && <Flex my="15px" />}
            <TeamComponent
              faceImg={Swit}
              name="Soravis Srinawakoon"
              title="CTO and Co-Founder"
              link={'https://www.linkedin.com/in/sorawit/'}
              type={1}
            >
              <Text
                mt="10px"
                fontSize="14px"
                textAlign="center"
                lineHeight={1.57}
                fontWeight={300}
              >
                M.Eng./S.B. in EECS
                <br />
                Massachusetts Institute of Technology
                <br />
                Hudson River Trading, Quora, Dropbox
              </Text>
            </TeamComponent>
            {_isMobile && <Flex my="15px" />}
            <TeamComponent
              faceImg={Paul}
              name="Paul Chonpimai"
              title="CPO and Co-Founder"
              link={'https://github.com/smiled0g'}
              type={0}
            >
              <Text
                mt="10px"
                fontSize="14px"
                textAlign="center"
                lineHeight={1.57}
                fontWeight={300}
              >
                Creator of Crypto Gaming Apps
                <br />
                with 800,000+ users
                <br />
                Tripadvisor, Turfmappx
              </Text>
            </TeamComponent>
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
              name="Kanisorn Thongprapaisaeng"
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
              width={['300px', '600px', '900px']}
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
          width={1}
        >
          <Flex
            flexDirection={['column', 'row']}
            justifyContent="center"
            width={['auto', '800px']}
            mb={['80px', '45px']}
          >
            <Flex flex={1} justifyContent="center" alignItems="center">
              <AbsoluteLink
                href="https://www.sequoiacap.com/"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Sequoia} height="20px" />
              </AbsoluteLink>
            </Flex>
            <Flex
              mt={[3, 0]}
              flex={1}
              justifyContent="center"
              alignItems="center"
            >
              <AbsoluteLink
                href="http://www.dunamupartners.com/"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Dunamu} height="20px" />
              </AbsoluteLink>
            </Flex>
            <Flex
              mt={[3, 0]}
              flex={1}
              justifyContent="center"
              alignItems="center"
            >
              <AbsoluteLink
                href="https://www.linkedin.com/company/seax-ventures/"
                css={{
                  '&:hover': {
                    filter:
                      'sepia(1) brightness(0.9) saturate(4) hue-rotate(196deg)',
                  },
                }}
              >
                <Image src={Seax} height="40px" />
              </AbsoluteLink>
            </Flex>
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
