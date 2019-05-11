import React from 'react'
import { colors } from 'ui'
import { Flex, Text } from 'ui/common'
import TxHashLink from 'components/TxHashLink'

const HistoryRow = ({ index, from, to, quantity, timeStamp, txLink }) => (
  <Flex
    flexDirection="row"
    style={{ minWidth: 0, overflow: 'hidden', height: '40px' }}
    bg={index % 2 === 0 ? 'white' : '#f9fbff'}
    alignItems="center"
  >
    <Flex
      flex={5}
      ml="30px"
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
    <Flex flex={2} justifyContent="center">
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
          index={i}
          from={from}
          to={to}
          quantity={quantity.pretty()}
          timeStamp={timeStamp.formal()}
          key={i}
          txLink={`https://rinkeby.etherscan.io/tx/${txHash}`}
        />
      )
    })}
  </React.Fragment>
)
