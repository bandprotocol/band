import React from 'react'
import PageContainer from 'components/PageContainer'
import styled from 'styled-components'
import { Flex, Text, Box, Card, Button, H1, H3, H4 } from 'ui/common'
import { getTCDInfomation } from 'utils/tcds'
import { getProfileColor } from 'ui/communities'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import MegaCommunityCard from 'components/MegaCommunityCard'
import HeaderBackgroundSrc from 'images/background-header.png'

const Header = styled(Card)`
  margin-top: 60px;
  height: 204px;
  width: 100%;
  background: linear-gradient(90deg, #6483e6 0%,#505fc9 99%);
  background-image: url('${HeaderBackgroundSrc}'); 
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-bottom-right-radius: 345px;
`

const AbsoluteLink = styled.a.attrs(props => ({
  href: props.to || props.href,
  target: '_blank',
  rel: 'noopener',
}))`
  text-decoration: none;
  color: inherit;
`

const WhiteButton = styled(Button).attrs({
  fontSize: '16px',
  fontWeight: '500',
  color: '#5269ff',
  bg: '#fff',
  width: '226px',
})`
  font-family: bio-sans;
  font-weight: 600;
  line-height: 44px;
  border-radius: 24px;
  cursor: pointer;
  padding: 0;
`

const WhiteOutlineButton = styled(Button).attrs({
  fontSize: '16px',
  color: '#fff',
  fontWeight: '500',
  mx: '15px',
})`
  font-family: bio-sans;
  font-weight: 600;
  background-color: transparent;
  border: 1px solid #fff;
  line-height: 44px;
  border-radius: 24px;
  cursor: pointer;
  padding: 0 20px;
`

const CountBadge = styled(Flex).attrs({
  color: '#fff',
  bg: '#42c47f',
  width: '40px',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '16px',
  ml: '10px',
})`
  font-family: bio-sans;
  font-weight: 600;
  line-height: 26px;
  border-radius: 15px;
`

export default ({ tcdCommunities, tcrCommunities, bandPrice, history }) => (
  <PageContainer
    fullWidth
    style={{
      background: 'white',
      paddingLeft: '0px',
      position: 'relative',
      background: '#E4EDFF',
    }}
  >
    <Header>
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        width="1170px"
        p="0px 32px"
        style={{ height: '100%', margin: '0 auto' }}
      >
        <H1 mb={2} py={2}>
          Data Governance Portal
        </H1>
        <Text
          my={1}
          width="750px"
          fontSize="17px"
          lineHeight="1.6"
          color="#ffffff"
        >
          Band Protocol connects ÐApps with trusted off-chain information,
          curated through a decentralized network of data providers. We use
          dataset tokens to incentivize providers.
        </Text>
        <Box mt={3}>
          <AbsoluteLink href="https://developer.bandprotocol.com/">
            <WhiteButton>Developer Reference</WhiteButton>
          </AbsoluteLink>
          <AbsoluteLink href="https://bandprotocol.com">
            <WhiteOutlineButton>
              Learn more about Band Protocol
            </WhiteOutlineButton>
          </AbsoluteLink>
        </Box>
      </Flex>
    </Header>
    {/* TODO: Fix this condition(loading forever when length === 0) and
    check yourcommunity, feature community as well */}
    {tcdCommunities && tcrCommunities ? (
      <Flex flexDirection="column">
        <Box
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <PageContainer dashboard>
            {/* TCD Communities */}
            <Flex flexDirection="row" alignItems="center" mt="15px" mb="10px">
              <H3 color="#4a4a4a" style={{ letterSpacing: '1px' }}>
                Available Datasets for DApps
              </H3>
              <CountBadge>{tcdCommunities.length}</CountBadge>
            </Flex>
            <Flex flexWrap="wrap" mt={3} mx="-20px" justifyContent="flex-start">
              {tcdCommunities.map((community, i) => (
                <MegaCommunityCard
                  key={i}
                  community={community}
                  bandPrice={bandPrice}
                  borderColor={getProfileColor(community.symbol)}
                  defaultTcd={
                    Object.keys(community.tcds).find(
                      tcdAddr =>
                        getTCDInfomation(community.tcds[tcdAddr].prefix)
                          .order === 1,
                    ) || Object.keys(community.tcds)[0]
                  }
                  isTcd
                  onClick={() =>
                    history.push(
                      `/community/${community.tokenAddress}/overview`,
                    )
                  }
                />
              ))}
            </Flex>
            {/* TCR Communities */}
            {tcrCommunities.length > 0 && (
              <Flex
                mb="100px"
                style={{
                  position: 'absolute',
                  left: '0px',
                  minWidth: '100vw',
                  height: '460px',
                  padding: '18px 32px 48px',
                }}
              >
                <Flex
                  flexDirection="column"
                  width="1110px"
                  style={{ margin: '80px auto' }}
                >
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    mt="12px"
                    mb={3}
                  >
                    <Text
                      fontSize="25px"
                      fontWeight="900"
                      color="#4a4a4a"
                      style={{ letterSpacing: '1px' }}
                    >
                      DApps built with Token Curated Registry
                    </Text>
                    <CountBadge>{tcrCommunities.length}</CountBadge>
                  </Flex>
                  <Flex
                    flexWrap="wrap"
                    mt={3}
                    mx="-20px"
                    justifyContent="flex-start"
                  >
                    {tcrCommunities.map((community, i) => (
                      <MegaCommunityCard
                        key={i}
                        community={community}
                        bandPrice={bandPrice}
                        statusBg="#2771ec"
                        onClick={() =>
                          history.push(
                            `/community/${community.tokenAddress}/overview`,
                          )
                        }
                      />
                    ))}
                  </Flex>
                </Flex>
              </Flex>
            )}
          </PageContainer>
        </Box>
      </Flex>
    ) : (
      // Loading icon
      <Flex
        style={{ height: 225 }}
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <CircleLoadingSpinner radius="80px" />
      </Flex>
    )}
  </PageContainer>
)
