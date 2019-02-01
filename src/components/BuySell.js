import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, Card } from 'ui/common'
import Graph from 'containers/PriceGraph'

// Mock Price data for 1 year
const mockData = () => {
  const startTime = 1483228800000
  const data = [[startTime, Math.random() * 5000]]
  for (let i = 0; i < 370; i++) {
    data.push([
      startTime + i * 1000 * 60 * 60 * 24,
      Math.abs(
        data[data.length - 1][1] + Math.floor(Math.random() * 1000 - 500),
      ),
    ])
  }
  return data
}

export default ({ showBuy, showSell }) => (
  <Card
    variant="primary"
    height="560px"
    width="870px"
    bg="#fff"
    mx="auto"
    mt="10px"
    p="20px"
    mb="10px"
    style={{ alignSelf: 'flex-start' }}
  >
    <Flex flexDirection="column">
      {/* Price Chart here*/}
      {/* TODO: just hack for demo, it will be fixed asap  */}
      <Graph communityName="CoinHatcher" />
      {/* Buy Sell Button */}
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        pt={4}
        pb={3}
      >
        <Button variant="submit" mx={3} width="180px" onClick={() => showBuy()}>
          <Text fontSize={1} fontWeight="bold">
            BUY
          </Text>
        </Button>
        <Button
          variant="cancel"
          mx={3}
          width="180px"
          onClick={() => showSell()}
        >
          <Text fontSize={1} fontWeight="bold">
            SELL
          </Text>
        </Button>
      </Flex>
    </Flex>
  </Card>
)
