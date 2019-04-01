import React from 'react'
import styled from 'styled-components'

import { colors } from 'ui'
import { Flex, Text, AbsoluteLink, Image, Bold } from 'ui/common'
import OutImg from 'images/out.svg'

const HistoryRow = ({ index, from, to, quantity, timeStamp, txLink }) => (
  <Flex
    flexDirection="row"
    style={{ minWidth: 0, overflow: 'hidden', height: '60px' }}
    bg={index % 2 === 0 ? 'white' : '#f9fbff'}
    alignItems="center"
  >
    <Flex
      flex={4}
      ml="30px"
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
      style={{
        minWidth: 0,
      }}
      justifyContent="flex-end"
    >
      <Text color={colors.text} fontSize={0}>
        {quantity}
      </Text>
    </Flex>
    <Flex
      flex={3}
      style={{
        minWidth: 0,
      }}
      justifyContent="flex-end"
    >
      <Text color={colors.text} fontSize={0} letterSpacing="0.5px">
        {timeStamp}
      </Text>
    </Flex>
    <Flex flex={2} justifyContent="center">
      <AbsoluteLink href={txLink}>
        <Image src={OutImg} width="14px" height="14px" />
      </AbsoluteLink>
    </Flex>
  </Flex>
)

export default ({ items }) => {
  return (
    <React.Fragment>
      {items.map((item, i) => {
        if (!item) {
          return <Flex width={1} key={i} style={{ height: '60px' }} />
        }
        const { txHash, from, to, quantity, timeStamp } = item
        return (
          <HistoryRow
            index={i}
            from={from}
            to={to}
            quantity={quantity.pretty()}
            timeStamp={new Date(timeStamp)
              .toUTCString()
              .split(' ')
              .slice(1, -1)
              .join(' ')}
            key={i}
            txLink={`https://rinkeby.etherscan.io/tx/${txHash}`}
          />
        )
      })}
    </React.Fragment>
  )
}
