import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
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

const FilledButton = styled(Button)`
  font-family: Avenir;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  width: 196px;
  height: 46px;
  border-radius: 2px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.15);
  background-color: #4a4a4a;
  cursor: pointer;

  transition: all 0.2s;

  &:hover {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }
`

const OutlineButton = styled(Button)`
  font-family: Avenir;
  color: #4a4a4a;
  font-size: 16px;
  font-weight: 500;
  background-color: white;
  width: ${props => (props.isMobile ? '196px' : '182px')};
  height: 46px;
  border-radius: 2px;
  cursor: pointer;

  transition: all 0.2s;

  &:hover {
    background-color: #6b7df5;
  }

  &:active {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }
`

export default () => {
  const exRef = useRef(null)
  const _isMobile = isMobile()
  return (
    <Box
      style={{
        background: '#f0f0f0',
        color: '#323232',
        overflow: 'hidden',
      }}
      mt="-80px"
    >
      {/* Section 1 */}
      <Box pt="60px" bg="f2f2f2">
        <PageContainer>
          <Flex
            pt={['50px', '100px']}
            pb={['50px', '10px']}
            justifyContent="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '48px']}
              color="#4a4a4a"
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

      {/* Section 3 */}
      <Box bg="#f0f0f0" mt="10px">
        <PageContainer>
          <Flex justifyContent="center">
            <Flex bg="pink" width="100%" style={{ height: '400px' }} />
          </Flex>

          {/* Part 1: Setup Band Wallet & Get Dataset Tokens */}
          <Flex justifyContent="space-between" mt="50px" alignItems="left">
            <Flex flexDirection="column" pr="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                {'Setup Band Wallet & Get Dataset Tokens'}
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '400px' }}
                mt="10px"
              >
                Data Governance Portal uses Band Wallet, a multi-signature,
                non-custodial Web3 wallet optimized for holding Band and Dataset
                tokens. It works just like any Ethereum wallet but integrates
                seemlessly within the webpage itself. Once setup, you can
                transfer Band tokens acquired from exchange (or faucet on
                Testnet) and buy into the dataset tokens you desire.
              </Text>
              <Flex mt="20px">
                {/* TODO: add link */}
                <Text color="#323232" fontWeight="bold">
                  Tutorial
                </Text>
              </Flex>
            </Flex>
            <Box width="400px" bg="black" style={{ height: '300px' }} />
          </Flex>

          {/* Part 2: Stake Dataset Tokens for Qualified Providers */}
          <Flex justifyContent="space-between" mt="50px" alignItems="left">
            <Box width="400px" bg="black" style={{ height: '300px' }} />
            <Flex flexDirection="column" pl="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Stake Dataset Tokens for Qualified Providers
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '500px' }}
                mt="10px"
              >
                Band Protocol uses delegated-proof-of-stake style consensus for
                picking who get to provide data for the dataset. There can be
                multiple provider candidates, but only top-k providers with most
                stakes are selected. Query fees get split among the the data
                providers and token stakers based on a fee set by governance
                parameters.
              </Text>
              <Flex mt="20px">
                {/* TODO: add link */}
                <Text color="#323232" fontWeight="bold">
                  Tutorial
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Part 3: Participate in Votings */}
          <Flex justifyContent="space-between" mt="50px" alignItems="left">
            <Flex flexDirection="column" pr="74px">
              <Text fontSize="18px" color="#4a4a4a" fontWeight="bold">
                Participate in Votings
              </Text>
              <Text
                fontWeight="300"
                style={{ lineHeight: '2', maxWidth: '400px' }}
                mt="10px"
              >
                Governance parameters dictate how the dataset smart contract
                perform its logics. Any dataset token holder can propose for a
                change; for example, anyone can propose to increase the data
                query fee from 0.001 ETH to 0.005 ETH. For the change to be
                applied though, a large enough portion of token holders must
                vote in agreement, which typically requires a community-wide
                coordination.
              </Text>
              <Flex mt="20px">
                {/* TODO: add link */}
                <Text color="#323232" fontWeight="bold">
                  Learn How
                </Text>
              </Flex>
            </Flex>
            <Box width="400px" bg="black" style={{ height: '300px' }} />
          </Flex>

          {/* Explore more feature button */}
          <Flex justifyContent="center" maxWidth="500px" my="100px">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              bg="#4a4a4a"
              p="16px 15px"
              width="100%"
              style={{ maxWidth: '500px', borderRadius: '4px' }}
            >
              <Text color="white" fontSize="16px">
                Access Data Governance Portal
              </Text>
              {/* TODO: change it into actual symbol */}
              <Text color="white" fontSize="16px">
                ->
              </Text>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
