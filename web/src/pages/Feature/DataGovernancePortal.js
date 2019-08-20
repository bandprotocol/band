import React, { useRef } from 'react'
import PageContainer from 'components/PageContainer'
import { Flex, Text, Button, Image, Box } from 'ui/common'
import { isMobile } from 'ui/media'
import BandappSrc from 'images/featured/bandapp.png'
import SetupBandSrcHome from 'images/featured/setupband-home.png'
import SetupBandSrcLogin from 'images/featured/setupband-login.png'
import StakeBand from 'images/featured/stakeband.png'
import BandVoting from 'images/featured/bandvoting.png'
import LinkWithArrow from 'components/LinkWithArrow'
import FilledButton from 'components/FilledButton'

export default () => {
  const exRef = useRef(null)
  const _isMobile = isMobile()
  return (
    <Box
      style={{
        background: 'white',
        color: '#323232',
        overflow: 'hidden',
      }}
      mt="-80px"
    >
      {/* Section 1 */}
      <Box pt="60px" bg="white">
        <PageContainer>
          <Flex
            mt={['89px']}
            mb={['40px']}
            justifyContent="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['24px', '48px']}
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Participate in Curations via
              <br />
              Data Governance Portal
            </Text>
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 2 */}
      <Box bg="white" mt="10px">
        <PageContainer>
          <Image src={BandappSrc} width="100%" style={{ zIndex: 0 }} />
          <Flex
            m="-15px 6px"
            py="8px"
            bg="#edefff"
            justifyContent="center"
            style={{
              height: '64px',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              boxShadow: '0 3px 3px 0 rgba(0,0,0,0.25)',
              zIndex: 1,
              position: 'relative',
            }}
          >
            <Button
              style={{
                width: '328px',
                height: '47.7',
                backgroundImage: 'linear-gradient(to bottom, #6179e1, #455ad3)',
              }}
            >
              <LinkWithArrow
                textColor="white"
                text="Access Data Governance"
                href="https://app.kovan.bandprotocol.com/"
              />
            </Button>
          </Flex>

          {/* Part 1: Setup Band Wallet & Get Dataset Tokens */}

          <Flex
            justifyContent="space-between"
            flexDirection="row"
            mt="175px"
            alignItems="left"
          >
            <Flex pr="74px" flex={2}>
              <Flex flexDirection="column">
                <Flex flexDirection={['column', 'row']}>
                  <Text
                    fontSize="28px"
                    lineHeight="32px"
                    color="#5569de"
                    fontWeight="bold"
                    mr="6px"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Setup Band Wallet
                  </Text>
                  <Text
                    fontSize="28px"
                    lineHeight="32px"
                    color="#3b426b"
                    fontWeight="bold"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {' & Get Dataset Tokens'}
                  </Text>
                </Flex>
                <Text
                  fontSize="18px"
                  lineHeight="36px"
                  color="#323232"
                  style={{ lineHeight: '2', maxWidth: '400px' }}
                  mt="10px"
                >
                  Data Governance Portal uses Band Wallet, a multi-signature,
                  non-custodial Web3 wallet optimized for holding Band and
                  Dataset tokens. It works just like any Ethereum wallet but
                  integrates seemlessly within the webpage itself. Once setup,
                  you can transfer Band tokens acquired from exchange (or faucet
                  on Testnet) and buy into the dataset tokens you desire.
                </Text>
                <Flex mt="24px">
                  <LinkWithArrow
                    style={{ fontSize: '20px', width: '100px' }}
                    text="Tutorial"
                    href="https://app.kovan.bandprotocol.com/"
                  />
                </Flex>
              </Flex>
            </Flex>
            <Box mt="20px" flex={1}>
              <Image src={SetupBandSrcHome} />
            </Box>
            <Box mt="20px" flex={1}>
              <Image src={SetupBandSrcLogin} />
            </Box>
          </Flex>

          {/* Part 2: Stake Dataset Tokens for Qualified Providers */}

          <Flex
            justifyContent="space-between"
            mt="122px"
            alignItems="left"
            flexDirection="row"
          >
            <Box flex={1} alignItems="center">
              <Image src={StakeBand} width="100%" />
            </Box>
            <Flex flexDirection="column" pl="74px" pt="30px" flex={1}>
              <Flex>
                <Text
                  fontSize="28px"
                  color="#5569de"
                  fontWeight="bold"
                  mr="5px"
                  style={{
                    lineHeight: '32px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Stake Dataset Tokens
                </Text>
                <Text
                  fontSize="28px"
                  color="#3b426v"
                  fontWeight="bold"
                  lineHeight="32px"
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  for Qualified Providers
                </Text>
              </Flex>
              <Text
                fontSize="18px"
                lineHeight="36px"
                color="#323232"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                my="19px"
              >
                Band Protocol uses delegated-proof-of-stake style consensus for
                picking who get to provide data for the dataset. There can be
                multiple provider candidates, but only top-k providers with most
                stakes are selected. Query fees get split among the the data
                providers and token stakers based on a fee set by governance
                parameters.
              </Text>
              <Flex mt="24px">
                <LinkWithArrow
                  style={{ fontSize: '20px', width: '100px' }}
                  text="Tutorial"
                  href="https://app.kovan.bandprotocol.com/"
                />
              </Flex>
            </Flex>
          </Flex>

          {/* Part 3: Participate in Votings */}

          <Flex justifyContent="space-between" mt="125.5px" alignItems="left">
            <Flex flexDirection="row">
              <Flex flexDirection="column" flex={1}>
                <Flex>
                  <Text
                    fontSize="28px"
                    mr="6px"
                    lineHeight="32px"
                    color="#4a4a4a"
                    fontWeight="bold"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Participate in
                  </Text>
                  <Text
                    fontSize="28px"
                    lineHeight="32px"
                    color="#5569de"
                    fontWeight="bold"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Votings
                  </Text>
                </Flex>
                <Text
                  fontSize="18px"
                  lineHeight="36px"
                  style={{ lineHeight: '2', maxWidth: '400px' }}
                  my="19px"
                >
                  Governance parameters dictate how the dataset smart contract
                  perform its logics. Any dataset token holder can propose for a
                  change; for example, anyone can propose to increase the data
                  query fee from 0.001 ETH to 0.005 ETH. For the change to be
                  applied though, a large enough portion of token holders must
                  vote in agreement, which typically requires a community-wide
                  coordination.
                </Text>
                <Flex mt="24px">
                  <LinkWithArrow
                    style={{ fontSize: '20px', width: '100px' }}
                    text="Learn How"
                    href="https://app.kovan.bandprotocol.com/"
                  />
                </Flex>
              </Flex>
              <Box mt="20px" flex={1}>
                <Image src={BandVoting} />
              </Box>
            </Flex>
          </Flex>

          {/* Explore more feature button */}

          <Flex justifyContent="center" maxWidth="500px" my="100px">
            <FilledButton
              width="400px"
              message="Access Data Governance Portal"
              arrow
              href="https://app.kovan.bandprotocol.com/"
            />
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
