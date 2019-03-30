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

const HistoryRow = ({ time, price, amount, type, txLink }) => (
  <Flex flexDirection="row" py={4}>
    <Flex flex={1} pl="30px">
      <Text color={colors.text} fontSize={0} letterSpacing="0.5px">
        {time}
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color={colors.text} fontSize={0}>
        {price}
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color={colors.text} fontSize={0}>
        {amount}
      </Text>
    </Flex>
    <Flex flex={1}>
      <Bold color={type === 'Buy' ? colors.green : colors.red} fontSize={0}>
        {type}
      </Bold>
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

export default ({ items }) => (
  <React.Fragment>
    {items.map(({ time, price, amount, type, txHash }) => (
      <HistoryRow
        time={time.formal()}
        price={price.pretty()}
        amount={amount.pretty()}
        type={type}
        key={txHash}
        // TODO: Change hardcode link depend to networkID
        txLink={`https://rinkeby.etherscan.io/tx/${txHash}`}
      />
    ))}
  </React.Fragment>
)
