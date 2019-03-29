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

const HistoryRow = ({ rank, address, balance, txLink }) => (
  <Flex flexDirection="row" py={4} style={{ minWidth: 0, overflow: 'hidden' }}>
    <Flex
      flex={1}
      pl="30px"
      pr="10px"
      style={{
        minWidth: 0,
      }}
      letterSpacing="0.5px"
    >
      <Text color={colors.text} fontSize={0}>
        {rank}
      </Text>
    </Flex>
    <Flex
      flex={2}
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
        {balance}
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
        {address}
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
      {items.map(({ rank, tokenAddress, address, balance }) => (
        <HistoryRow
          rank={rank}
          address={address}
          balance={balance.pretty()}
          key={rank}
          // TODO: Change hardcode link depend to networkID
          txLink={`https://rinkeby.etherscan.io/token/${tokenAddress}?a=${address}`}
        />
      ))}
    </React.Fragment>
  )
}
