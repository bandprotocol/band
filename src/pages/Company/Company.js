import React, { useState } from 'react'
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
import media, { isMobile } from 'ui/media'

import FeatureCard from 'components/FeatureCard'
import StartBuilding from 'components/StartBuilding'

import CompanySrc from 'images/company.svg'
import TCDWorkSrc from 'images/tcd-work.svg'
import TCDPriceFeed from 'images/tcd-price-feed.png'
import TCDCrossChain from 'images/tcd-cross-chain.png'

import CoinDeskSrc from 'images/featured/coindesk.png'
import YahooNewsSrc from 'images/featured/yahoo-news.png'
import TechInAsiaSrc from 'images/featured/tech-in-asia.png'
import E27Src from 'images/featured/e27.png'
import DealSrc from 'images/featured/deal.png'
import BTSrc from 'images/featured/bt.png'
import JumpstartSrc from 'images/featured/jumpstart.png'
import Linkedin from 'images/linkedin.svg'
import WeRHiring from 'images/weRHiring.svg'

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

const TeamComponent = ({ faceImg, name, title }) => (
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
      <Image src={Linkedin} width="20px" height="20px" />
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
      border: isSelected ? 'solid 1px #6b8bf5' : 'solid 1px #c9ced4',
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
  const [selectedTab, setSelectedTab] = useState(1)
  return (
    <Flex flexDirection="row">
      <JobTab
        title="Mobile
    App Engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 0}
        setSelectedTab={() => setSelectedTab(0)}
      />
      <Flex mx="15px" />
      <JobTab
        title="Mobile
    App Engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 1}
        setSelectedTab={() => setSelectedTab(1)}
      />
      <Flex mx="15px" />
      <JobTab
        title="Mobile
    App Engineer"
        description="Bangkok — Full Time"
        isSelected={selectedTab === 2}
        setSelectedTab={() => setSelectedTab(2)}
      />
    </Flex>
  )
}

export default class LandingPage extends React.Component {
  render() {
    return (
      <Box>
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" mb={4}>
            <Box mt={5} mb={2}>
              <H1 textAlign="center" dark>
                Company
              </H1>
            </Box>
            <Text
              textAlign="center"
              width="780px"
              fontSize={2}
              lineHeight={1.94}
            >
              Band Protocol is a protocol for decentralized data governance. We
              provide open-source standard and framework for the decentralized
              management of data.
            </Text>
            <Image src={CompanySrc} my={5} />
            <Card bg="#fafafa" px="45px" py="25px" width="840px">
              <Text
                textAlign="center"
                fontSize="18px"
                color="#4c4c4c"
                lineHeight={1.94}
              >
                Band Protocol was created to solve the issues plaguing current
                data infrastructures and decentralized technologies as a whole.
                It is estimated that over 1.2 million terabytes of data is
                stored on the web and currently much of this is unstructured
                data or unreliable data.
                <br />
                <br />
                Band Protocol is a component layer solution for managing data in
                the Web3 technology stack. With the use of an innovative token
                framework and standardized data protocols, Band is able to
                create a community-driven data curation ecosystem that is
                secure, reliable and accessible.
                <br />
                <br />
                Through the use of a standard framework, Band is able to provide
                a socially scalable method for widespread adoption and
                integration of trusted data that all dApps can utilize.
              </Text>
            </Card>
          </Flex>
          <Flex
            flexDirection="column"
            alignItems="center"
            pt="60px"
            mt="60px"
            mx="-40px"
            style={{
              borderTop: 'solid 1px #e2e2e2',
              borderBottom: 'solid 1px #e2e2e2',
            }}
          >
            <Box mb={3}>
              <H1 textAlign="center" dark>
                <Text color="#2a304e" fontSize="38px" lineHeight={1.5}>
                  Featured In
                </Text>
              </H1>
            </Box>
            <Flex
              alignItems="center"
              flexWrap="wrap"
              justifyContent="center"
              mb="40px"
            >
              <Featured href="https://www.dealstreetasia.com/stories/sequoia-india-band-protocol-121721/">
                <img height="65" src={DealSrc} />
              </Featured>
              <Featured href="https://www.coindesk.com/sequoia-india-leads-3-million-round-for-token-startup-tackling-fake-news">
                <img height="32px" src={YahooNewsSrc} />
              </Featured>
              <Featured href="https://sg.news.yahoo.com/blockchain-based-information-curation-startup-band-protocol-secures-010013124.html">
                <img height="40px" src={CoinDeskSrc} />
              </Featured>
              <Featured href="https://jumpstartmag.com/blog/band-protocol-raises-us3-million-seed-funding-led-by-sequoia-india-to-give-power-back-to-internet">
                <img height="42" src={JumpstartSrc} />
              </Featured>
              <Featured href="https://www.techinasia.com/band-protocol-nets-3m-seed-funding-sequoia-india">
                <img height="33px" src={TechInAsiaSrc} />
              </Featured>
              <Featured href="https://e27.co/blockchain-based-information-curation-startup-band-protocol-secures-us3m-seed-funding-20190217/">
                <img height="48" src={E27Src} />
              </Featured>
              <Featured href="https://www.businesstimes.com.sg/garage/blockchain-startup-band-protocol-raises-us3m-seed-round-led-by-sequoia-india">
                <img height="55" src={BTSrc} />
              </Featured>
            </Flex>
          </Flex>
          <Box mt="35px">
            <H1 textAlign="center" dark>
              <Text color="#2a304e" fontSize="38px" lineHeight={1.5}>
                Team & Advisors
              </Text>
            </H1>
            <Flex flexDirection="row" mt="50px">
              <TeamComponent
                faceImg={Man}
                name="Soravis Srinawakoon"
                title="CEO and Co-Founder"
              />
              <TeamComponent
                faceImg={Swit}
                name="Soravis Srinawakoon"
                title="CTO and Co-Founder"
              />
              <TeamComponent
                faceImg={Paul}
                name="Paul Chonpimai"
                title="CPO and Co-Founder"
              />
            </Flex>
            <Flex flexDirection="row" mt="50px">
              <TeamComponent
                faceImg={Bun}
                name="Bun Uthaitirat"
                title="Chief Fun Officer and Developer"
              />
              <TeamComponent
                faceImg={Peach}
                name="Kanisorn Thongprapaisaenh"
                title="Developer"
              />
              <TeamComponent
                faceImg={Ming}
                name="Subongkoch Maneerat"
                title="UX/UI Designer"
              />
            </Flex>
            <Flex flexDirection="row" mt="50px">
              <TeamComponent name="Prin Rangsiruji" title="Developer" />
              <TeamComponent name="Mean" title="Administrator" />
              <Flex flex={1} />
            </Flex>
          </Box>
        </PageContainer>
        <Box bg="#fafafa" mt="60px" pb="60px">
          <H1 textAlign="center" dark pt="50px">
            <Text color="#2a304e" fontSize="38px" lineHeight={1.5}>
              We're Hiring!
            </Text>
          </H1>
          <Flex
            width={1}
            justifyContent="center"
            style={{ position: 'relative' }}
          >
            <Image
              src={WeRHiring}
              width="900px"
              style={{ position: 'absolute', zIndex: 0 }}
            />
            <Flex mt="55px">
              <JobTabs />
            </Flex>
          </Flex>
          <PageContainer />
        </Box>
        <Box>
          <Flex justifyContent="center" mt="60px">
            <Text
              lineHeight={1.5}
              color="#2a304e"
              fontSize="38px"
              fontWeight="900"
            >
              Our Partners
            </Text>
          </Flex>
          <Flex mt="45px" flexDirection="row" justifyContent="center">
            <Flex
              bg="rgba(0,0,0,0)"
              flexDirection="column"
              style={{
                width: '425px',
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
                <Image src={Sequoia} width="148px" />
              </Flex>
              <Flex mt="35px">
                <Image src={Dunamu} width="245px" />
              </Flex>
              <Flex mt="35px">
                <Image src={Seax} width="105px" height="45px" />
              </Flex>
            </Flex>
            <Flex mx="18px" />
            <Flex
              bg="rgba(0,0,0,0)"
              flexDirection="column"
              px="40px"
              style={{
                width: '425px',
                height: '325px',
              }}
            >
              <Flex>
                <Text fontSize="22px" fontWeight={600} color="#4a4a4a">
                  Join Band Protocol Community
                </Text>
              </Flex>
              <Flex
                fontSize="18px"
                mt="40px"
                alignItems="center"
                color="#7c84a6"
              >
                <Image src={Reddit} fill="red" width="30px" />
                <Flex mx="20px" />
                Reddit
                <Flex mx="20px" />
              </Flex>
              <Flex
                fontSize="18px"
                mt="35px"
                alignItems="center"
                color="#7c84a6"
              >
                <Image src={Telegram} width="30px" />
                <Flex mx="20px" />
                Telegram
              </Flex>
              <Flex
                fontSize="18px"
                mt="35px"
                alignItems="center"
                color="#7c84a6"
              >
                <Image src={Medium} width="30px" />
                <Flex mx="20px" />
                Medium
              </Flex>
              <Flex
                fontSize="18px"
                mt="35px"
                alignItems="center"
                color="#7c84a6"
              >
                <Image src={Twitter} width="30px" />
                <Flex mx="20px" />
                Twitter
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
    )
  }
}
