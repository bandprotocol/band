import React from 'react'
import styled from 'styled-components'

import { colors } from 'ui'
import {
  Flex,
  Text,
  BackgroundCard,
  H1,
  Button,
  Image,
  Box,
  H3,
  H4,
  AbsoluteLink,
  Link,
  Card,
  Bold,
} from 'ui/common'

const HistoryRow = ({ txHash, from, to, quantity, txLink }) => (
  <Flex flexDirection="row" py={4}>
    <Flex flex={2} pl="55px">
      <Text color={colors.text} fontSize={0}>
        {from}
      </Text>
    </Flex>
    <Flex flex={2}>
      <Text color={colors.text} fontSize={0}>
        {to}
      </Text>
    </Flex>
    <Flex flex={2}>
      <Text color={colors.text} fontSize={0}>
        {quantity}
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color={colors.text} fontSize={0} letterSpacing="0.5px">
        {txHash}
      </Text>
    </Flex>
    <Flex flex={1}>
      <AbsoluteLink
        href={txLink}
        style={{ marginLeft: 10, fontSize: '0.9em' }}
        dark
      >
        <i className="fas fa-external-link-alt" />
      </AbsoluteLink>
    </Flex>
  </Flex>
)

export default ({ items }) => {
  console.log(items)
  return (
    <React.Fragment>
      {items.map(({ txHash, from, to, quantity }) => (
        <HistoryRow
          txHash={txHash}
          from={from}
          to={to}
          quantity={quantity.pretty()}
          key={txHash}
          // TODO: Change hardcode link depend to networkID
          txLink={`https://rinkeby.etherscan.io/tx/${txHash}`}
        />
      ))}
    </React.Fragment>
  )
}
