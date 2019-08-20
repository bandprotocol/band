import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import FilledButton from 'components/FilledButton'
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
import DualTokenSrc from 'images/featured/dual-token.png'
import DataSetTokenSrc from 'images/featured/dataset-token.png'
import DataSetTokenSrc2 from 'images/featured/dataset-token-2.png'
import BondingCurveSrc from 'images/featured/bonding-curve.png'

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

const OvalNumber = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
})`
  border-radius: 50%;
  width: 43.2px;
  height: 43.2px;
`

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
      <Box pt="60px" bg="f2f2f2">
        <PageContainer>
          <Flex
            pt={['50px', '100px']}
            pb={['50px', '60px']}
            justifyContent="center"
            flexDirection="column"
          >
            <Text
              lineHeight="80px"
              fletterSpacing="1px"
              fontSize={['32px', '60px']}
              fontWeight="bold"
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Incentivising Adoptions through
              <br />
              Dual-Token Economics
            </Text>
            <Text
              textAlign="center"
              mt="20px"
              lineHeight="36px"
              fontSize={['18px']}
              color="#323232"
              style={{ lineHeight: '2' }}
            >
              Band Protocol functions on two types of tokens: Dataset Tokens and
              BAND Token. Here's how we use the two tokens to create economic
              incentives that allow users to support the creation of reliable
              and accessible datasets.
            </Text>
            <Image src={DualTokenSrc} />
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 2: Dataset Tokens */}
      <Box bg="white" mt="50px">
        <PageContainer>
          <Flex flexDirection="row" alignItems="center">
            <OvalNumber bg="#5569de" mr="20px">
              <Text
                lineHeight="80px"
                fontWeight="bold"
                fontSize="23px"
                color="#ffffff"
              >
                1
              </Text>
            </OvalNumber>
            <Flex>
              <Text
                lineHeight="80px"
                fontWeight="bold"
                fontSize={['32px', '28px']}
                color="#3b426b"
                textAlign={['center', 'left']}
              >
                Dataset Tokens
              </Text>
            </Flex>
          </Flex>
          <Text fontSize="18px" lineHeight={2} color="#323232">
            A dataset token is a token that anyone can buy into that grants the
            holder the right to participate in the activities that the community
            issuing the token conduct. There are two jobs for the dataset token
            holders: they can either <br />
            1) become a "data provider" who is responsible for curating
            high-quality data and feed it to smart contracts or <br />
            2) participate in the community (as a user of the data from that
            dataset) and vote for data providers they trust to do the hard work
            for them. With only the top provider gaining the right to contribute
            data to the dataset.
          </Text>
          {/* Part 1 */}
          <Flex mt="45px" justifyContent="space-between" alignItems="center">
            <Box flex={1} pr="82.7px">
              <Image src={DataSetTokenSrc} />
            </Box>
            <Flex pt="12px" flex={1} ml="82.7px">
              <Text fontSize="18px" lineHeight="36px" color="#323232">
                The primary source of incentive in the system is from selling
                the data to smart contracts. Every time the data is sold, the
                rewards get distributed to each data provider and subsequently
                all the community users who have voted/staked for them. The
                better providers the community select, the more trustworthy the
                data becomes in a long run, driving up the potential revenue and
                hence value for every token holder.
              </Text>
            </Flex>
          </Flex>

          <Flex justifyContent="space-between" mt="40px" alignItems="center">
            <Flex flex={1}>
              <Text fontSize="18px" lineHeight="36px" color="#323232">
                This mechanism ensures that everyone involved in the process of
                building a dataset has an aligned economic incentive.
                Competition from multiple datasets in the same vertical further
                drives the quality of each dataset. Eventually the real
                beneficiaries here are all the users who benefit from the more
                secure smart contract design.
              </Text>
            </Flex>
            <Box pl="98.7" flex={1}>
              <Image src={DataSetTokenSrc2} />
            </Box>
          </Flex>

          {/* Part 2 */}
          <Flex flexDirection="column" mt="40px">
            <Flex flexDirection="row" alignItems="center">
              <OvalNumber bg="#5569de">
                <Text
                  lineHeight="80px"
                  fontWeight="bold"
                  fontSize="23px"
                  color="#ffffff"
                >
                  2
                </Text>
              </OvalNumber>
              <Flex ml="25px" mb="25px">
                <Text
                  lineHeight="80px"
                  fontWeight="bold"
                  fontSize={['32px', '28px']}
                  color="#3b426b"
                  textAlign={['center', 'left']}
                >
                  Band Tokens
                </Text>
              </Flex>
            </Flex>
            <Flex flexDirection="row">
              <Box pr="110px">
                <Image src={BondingCurveSrc} />
              </Box>
              <Flex flexDirection="column">
                <Text
                  fontSize="18px"
                  lineHeight="36px"
                  color="#323232"
                  mb="24px"
                >
                  BAND token functions as collateral for dataset tokens. Dataset
                  tokens are issued and redeemed through a Bonding Curve
                  mechanism, guaranteeing instant liquidity and sufficient value
                  for correct dataset incentives to function properly.
                </Text>
                <FilledButton
                  message="Get Band Airdrop"
                  bg="linear-gradient(to bottom, #00a4ff, #5569de)"
                  arrow
                  width="233px"
                  fontSize="14px"
                  href="http://airdrop.bandprotocol.com/"
                />
              </Flex>
            </Flex>
          </Flex>

          {/* Visualizing How Data are Curated button */}
          <Flex justifyContent="center" alignItems="center" my="50px">
            <FilledButton
              message="Next: Visualizing How Data are Curated"
              arrow
              width="500px"
              to="/features/tcd"
            />
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
