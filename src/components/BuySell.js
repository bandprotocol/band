import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, Card } from 'ui/common'

export default ({ showBuy, showSell }) => (
  <Card
    variant="primary"
    height="560px"
    width="870px"
    bg="#fff"
    mx="auto"
    mt="10px"
    mb="10px"
    style={{ alignSelf: 'flex-start' }}
  >
    <Flex flexDirection="column" py={3}>
      {/* Price Chart here*/}
      <Flex flexDirection="row" justifyContent="center" alignItems="center">
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
