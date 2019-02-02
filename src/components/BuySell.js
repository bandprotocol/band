import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, Card } from 'ui/common'
import Graph from 'containers/PriceGraph'

export default ({ showBuy, showSell, communityName }) => (
  <Card
    variant="detail"
    bg="#fff"
    mt="10px"
    p="20px"
    mb="10px"
    style={{ alignSelf: 'flex-start' }}
  >
    <Flex flexDirection="column">
      {/* Price Chart here*/}
      <Graph communityName={communityName} />
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
