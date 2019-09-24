import React from 'react'
import { colors } from 'ui'
import { Flex, Text } from 'ui/common'
import { getLink } from 'utils/etherscan'
import TxHashLink from 'components/TxHashLink'

const HistoryRow = ({ from, to, quantity, timeStamp, txLink }) => (
  <Flex
    flexDirection="row"
    mx="20px"
    style={{
      minWidth: 0,
      overflow: 'hidden',
      height: '40px',
      borderBottom: 'solid 1px #eef3ff',
    }}
    alignItems="center"
  >
    <Flex
      flex={5}
      ml="10px"
      style={{
        minWidth: 0,
      }}
      letterSpacing="0.5px"
    >
      <Text
        color={colors.text}
        fontFamily="code"
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
      flex={5}
      ml="15px"
      style={{
        minWidth: 0,
      }}
      letterSpacing="0.5px"
    >
      <Text
        color={colors.text}
        fontFamily="code"
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
      flex={2}
      style={{
        minWidth: 0,
      }}
      justifyContent="flex-end"
      fontFamily="code"
    >
      <Text color={colors.text} fontSize={0}>
        {quantity}
      </Text>
    </Flex>
    <Flex
      flex={4}
      style={{
        minWidth: 0,
      }}
      justifyContent="flex-end"
    >
      <Text color={colors.text} fontSize={0} letterSpacing="0.5px">
        {timeStamp}
      </Text>
    </Flex>
    <Flex flex={1.7} justifyContent="center">
      <TxHashLink href={txLink} />
    </Flex>
  </Flex>
)

export default ({ items }) => (
  <React.Fragment>
    {items.map((item, i) => {
      if (!item) {
        return <Flex width={1} key={i} style={{ height: 48 }} />
      }
      const { txHash, from, to, quantity, timeStamp } = item
      return (
        <HistoryRow
          from={from}
          to={to}
          quantity={quantity.pretty()}
          timeStamp={timeStamp.formal()}
          key={i}
          txLink={`${getLink()}/tx/${txHash}`}
        />
      )
    })}
  </React.Fragment>
)
