import React from 'react'
import styled from 'styled-components'
import { Flex, Card, Text, Box, Button } from 'ui/common'
import PageContainer from 'components/PageContainer'
import MiniGraph from 'components/MiniGraph'
import graphGreen from 'images/graphGreen.svg'
import graphRed from 'images/graphRed.svg'
import graphBlue from 'images/graphBlue.svg'
import CommunityDescription from 'components/CommunityDescription'
import DetailHistory from 'components/DetailHistory'
import CurveGraph from 'components/CurveGraph'
import BN from 'utils/bignumber'
import { calculatePriceAt } from 'utils/equation'
import AutoSizer from 'react-virtualized-auto-sizer'
import Graph from 'components/PriceGraph'

const GrayButton = styled(Button).attrs({
  variant: 'grey',
})`
  padding: 0px;
  width: 120px;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
`

export default props => {
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
    collateralEquation,
  } = props

  const dataset = []
  if (collateralEquation) {
    const bnTotalSupply = BN.parse(totalSupply)
    for (let mult = 0; mult <= 20; mult++) {
      const supplyPoint = bnTotalSupply.muln(mult).divn(10)
      dataset.push({
        x: supplyPoint.pretty(),
        y: calculatePriceAt(collateralEquation, supplyPoint.toString()),
      })
    }
  }

  return (
    <PageContainer withSidebar bg="#f2f4f9" style={{ minWidth: 0 }}>
      <CommunityDescription communityAddress={communityAddress} />
      <Flex flexDirection="row" mt="24px" mx="-6px">
        <Card flex={1} variant="dashboard" mx="6px">
          <Text
            mt={1}
            fontSize="15px"
            mt="12px"
            fontWeight="900"
            color="#393939"
          >
            PRICE MOVEMENT
          </Text>
          <Box style={{ height: 300 }}>
            <AutoSizer>
              {({ height, width }) => (
                <Box style={{ height, width }}>
                  <Graph
                    communityAddress={communityAddress}
                    height={height}
                    width={width}
                  />
                </Box>
              )}
            </AutoSizer>
          </Box>
          <Flex mb={1}>
            <Box flex={1} pl={2}>
              <Text py={2} fontSize="14px" fontWeight="500" color="#777777">
                Current Price
              </Text>
              <Text
                mt="8px"
                fontSize="25px"
                letterSpacing="0.1px"
                fontWeight={500}
              >
                {BN.parse(price).pretty()} BAND
                <Text
                  ml={2}
                  fontSize="0.7em"
                  style={{ display: 'inline-block' }}
                >
                  / {symbol}
                </Text>
              </Text>
              <Text
                fontSize="18px"
                fontWeight="500"
                lineHeight="2.2em"
                color="#757575"
              >
                {BN.parse(price)
                  .bandToUSD(bandPrice)
                  .pretty()}{' '}
                USD / {symbol}
              </Text>
            </Box>
            <Flex flexDirection="column" justifyContent="center" mr={2}>
              <Button onClick={showBuy} variant="blue">
                <Text fontSize="14px" fontWeight="600">
                  BUY
                </Text>
              </Button>
              <Button mt={2} onClick={showSell} variant="grey">
                <Text fontSize="14px" fontWeight="600">
                  SELL
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Card>
        <Flex flexDirection="column" mx="6px" my="-4px">
          <MiniGraph
            title="Market Cap"
            value={BN.parse(marketCap).shortPretty()}
            unit="BAND"
            subValue={`${BN.parse(marketCap)
              .bandToUSD(bandPrice)
              .shortPretty()} USD`}
          />
          <MiniGraph
            title={'Token Supply'}
            value={BN.parse(totalSupply).shortPretty()}
            unit={symbol}
            subValue={`BAND as collateral`}
          />
          <MiniGraph
            title="Total Address"
            value={numberOfHolders}
            unit="holders"
          />
        </Flex>
        <Card flex="0 0 290px" variant="dashboard" mx="6px">
          <Text
            mt={1}
            fontSize="15px"
            mt="12px"
            fontWeight="900"
            color="#393939"
          >
            DATA GOVERNANCE
          </Text>
          <Box style={{ height: 200 }} />
        </Card>
      </Flex>

      <Flex mt="24px">
        <DetailHistory communityAddress={communityAddress} pageSize={10} />
      </Flex>
    </PageContainer>
  )
}
