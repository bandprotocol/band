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
} from 'ui/common'

const HistoryRow = ({ time, price, amount, type }) => (
  <Flex flexDirection="row" py={4}>
    <Text pl="56.5px" color={colors.text} fontSize={0} letterSpacing="0.5px">
      {time}
    </Text>
    <Text pl="83.5px" color={colors.text} fontSize={0}>
      {price}
    </Text>
    <Text pl="73px" color={colors.text} fontSize={0}>
      {amount}
    </Text>
    <Text
      pl="95px"
      color={type === 'Buy' ? colors.green : colors.red}
      fontSize={0}
    >
      {type}
    </Text>
  </Flex>
)

export default ({ items }) => (
  <React.Fragment>
    {items.map(({ time, price, amount, type }) => (
      <HistoryRow
        time={time.formal()}
        price={price.pretty()}
        amount={amount.pretty()}
        type={type}
      />
    ))}
  </React.Fragment>
)
