import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, Box, Button, Card } from 'ui/common'
import PageContainer from 'components/PageContainer'
import MiniGraph from 'components/MiniGraph'
import graphGreen from 'images/graphGreen.svg'
import graphRed from 'images/graphRed.svg'
import graphBlue from 'images/graphBlue.svg'

import CommunityDescription from 'components/CommunityDescription'
import DetailHistory from 'components/DetailHistory'
import BuySell from 'components/BuySell'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import BN from 'utils/bignumber'

import Graph from 'components/PriceGraph'

const GrayButton = styled(Button)`
  padding: 0px;
  width: 120px;
  height: 40px;
  border-radius: 4px;
  box-shadow: 0 3px 5px 0 #b4bbda;
  background-color: #7c84a6;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-align: center;
`

export default props => {
  console.log('comm detail props : ', props)
  const {
    numberOfHolders,
    communityAddress,
    showBuy,
    showSell,
    symbol,
    price,
    bandPrice,
    marketCap,
    totalSupply,
  } = props
  console.log(totalSupply, marketCap)
  return (
    <PageContainer withSidebar bg="#f2f4f9" style={{ minWidth: 0 }}>
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        mt="30px"
        mb="60px"
      >
        <Flex flex={1}>
          <Text
            style={{
              fontFamily: 'Avenir',
              fontSize: '25px',
              fontWeight: '900',
              letterSpacing: '-0.6px',
              textAlign: 'center',
              color: '#4a4a4a',
            }}
          >
            {`${BN.parse(price).pretty()} BAND / ${symbol}`}
          </Text>
        </Flex>
        <Flex flex={1}>
          <Text
            style={{ fontSize: '19px', lineHeight: 1.68, color: '#7c84a6' }}
          >
            {`${BN.parse(price)
              .bandToUSD(bandPrice)
              .pretty()} USD / ${symbol}`}
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          mt="10px"
        >
          <Flex mr="15px">
            <GrayButton onClick={showBuy}>Buy</GrayButton>
          </Flex>
          <Flex ml="15px">
            <GrayButton onClick={showSell}>Sell</GrayButton>
          </Flex>
        </Flex>
      </Flex>
      <CommunityDescription communityAddress={communityAddress} />
      <Flex flexDirection="row" mt="30px">
        <Flex flexDirection="row" flex={1} mr="15px">
          <Flex mr="15px" flex={1}>
            <MiniGraph
              title="Total Address"
              value={numberOfHolders}
              unit="holders"
              graphSrc={graphBlue}
            />
          </Flex>
          <Flex ml="15px" flex={1}>
            <MiniGraph
              title={'Supply'}
              value={BN.parse(totalSupply).shortPretty()}
              unit={symbol}
            />
          </Flex>
        </Flex>
        <Flex flexDirection="row" flex={1} ml="15px">
          <Flex mr="15px" flex={1}>
            <MiniGraph
              title={'Price'}
              value={BN.parse(price).shortPretty()}
              unit="BAND"
              valueUsd={BN.parse(price)
                .bandToUSD(bandPrice)
                .shortPretty()}
              graphSrc={graphGreen}
            />
          </Flex>
          <Flex ml="15px" flex={1}>
            <MiniGraph
              title="Market Cap"
              value={BN.parse(marketCap).shortPretty()}
              unit="BAND"
              valueUsd={BN.parse(marketCap)
                .bandToUSD(bandPrice)
                .shortPretty()}
              graphSrc={graphRed}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDirection="row" mt="30px">
        <Flex
          flex={1 / 2}
          mr="15px"
          bg="white"
          style={{ height: '330px', borderRadius: '10px' }}
          justifyContent="center"
          alignItems="center"
        >
          <Graph communityAddress={communityAddress} />
        </Flex>
        <Flex
          flex={1 / 2}
          ml="15px"
          bg="white"
          style={{ height: '330px', borderRadius: '10px' }}
          justifyContent="center"
          alignItems="center"
        >
          <Text>dummy</Text>
        </Flex>
      </Flex>
      <Flex mt="30px">
        <DetailHistory communityAddress={communityAddress} pageSize={10} />
      </Flex>
    </PageContainer>
  )
}
