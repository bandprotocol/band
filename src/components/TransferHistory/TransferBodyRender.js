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

const HistoryRow = ({ from, to, quantity, timeStamp, txLink }) => (
  <Flex flexDirection="row" py={4} style={{ minWidth: 0, overflow: 'hidden' }}>
    <Flex
      flex={4}
      pl="30px"
      pr="10px"
      style={{
        minWidth: 0,
      }}
      letterSpacing="0.5px"
    >
      <Text
        color={colors.text}
        fontSize={0}
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {from}
      </Text>
    </Flex>
    <Flex
      flex={4}
      pr="10px"
      style={{
        minWidth: 0,
      }}
      letterSpacing="0.5px"
    >
      <Text
        color={colors.text}
        fontSize={0}
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {to}
      </Text>
    </Flex>
    <Flex
      flex={3}
      pr="10px"
      style={{
        minWidth: 0,
      }}
    >
      <Text color={colors.text} fontSize={0}>
        {quantity}
      </Text>
    </Flex>
    <Flex
      flex={3}
      pr="10px"
      style={{
        minWidth: 0,
      }}
    >
      <Text color={colors.text} fontSize={0} letterSpacing="0.5px">
        {timeStamp}
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
  return (
    <React.Fragment>
      {items.map(({ txHash, from, to, quantity, timeStamp }) => (
        <HistoryRow
          from={from}
          to={to}
          quantity={quantity.pretty()}
          timeStamp={new Date(timeStamp)
            .toUTCString()
            .split(' ')
            .slice(1, -1)
            .join(' ')}
          key={txHash}
          // TODO: Change hardcode link depend to networkID
          txLink={`https://rinkeby.etherscan.io/tx/${txHash}`}
        />
      ))}
    </React.Fragment>
  )
}
