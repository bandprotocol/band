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
import CurveGraph from 'components/CurveGraph'
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
          <CurveGraph
            title=""
            xLabel="Token Supply"
            yLabel="Price"
            dataset={[
              { x: 0, y: 0 },
              { x: 50000, y: 0.0062499999999999995 },
              { x: 100000, y: 0.19999999999999998 },
              { x: 150000, y: 1.5187499999999998 },
              { x: 200000, y: 6.3999999999999995 },
              { x: 250000, y: 19.53125 },
              { x: 300000, y: 48.599999999999994 },
              { x: 350000, y: 105.04375 },
              { x: 400000, y: 204.79999999999998 },
              { x: 450000, y: 369.05625 },
              { x: 500000, y: 625 },
              { x: 550000, y: 1006.5687499999998 },
              { x: 600000, y: 1555.1999999999998 },
              { x: 650000, y: 2320.5812499999993 },
              { x: 700000, y: 3361.4 },
              { x: 750000, y: 4746.093749999999 },
              { x: 800000, y: 6553.599999999999 },
              { x: 850000, y: 8874.106249999999 },
              { x: 900000, y: 11809.8 },
              { x: 950000, y: 15475.618749999998 },
              { x: 1000000, y: 20000 },
            ]}
            xDataset={[
              0,
              50000,
              100000,
              150000,
              200000,
              250000,
              300000,
              350000,
              400000,
              450000,
              500000,
              550000,
              600000,
              650000,
              700000,
              750000,
              800000,
              850000,
              900000,
              950000,
              1000000,
            ]}
            width={260}
            height={200}
            config={{ stepSize: 2000, suggestedMax: 20000 }}
          />
        </Flex>
      </Flex>
      <Flex mt="30px">
        <DetailHistory communityAddress={communityAddress} pageSize={10} />
      </Flex>
    </PageContainer>
  )
}
