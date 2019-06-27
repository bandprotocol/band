import React from 'react'
import { colors } from 'ui'
import { Flex, Text } from 'ui/common'

const HistoryRow = ({ index, rank, address, balance, txLink, percentage }) => (
  <Flex
    flexDirection="row"
    style={{ minWidth: 0, overflow: 'hidden', height: '40px' }}
    bg={index % 2 === 0 ? 'white' : '#f9fbff'}
    alignItems="center"
  >
    <Flex
      flex={2}
      ml="40px"
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
      flex={5}
      style={{
        minWidth: 0,
      }}
      letterSpacing="0.5px"
    >
      <Text
        fontFamily="code"
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
    <Flex
      flex={3}
      style={{
        minWidth: 0,
      }}
      justifyContent="flex-end"
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
        {balance}
      </Text>
    </Flex>
    <Flex
      flex={2}
      mr="30px"
      style={{
        minWidth: 0,
      }}
      justifyContent="flex-end"
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
        {percentage}
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({ items }) => {
  return (
    <React.Fragment>
      {items.map((item, i) => {
        if (!item) {
          return <Flex width={1} key={i} style={{ height: 48 }} />
        }
        const { rank, tokenAddress, address, balance, percentage } = item
        return (
          <HistoryRow
            index={i}
            rank={rank}
            address={address}
            balance={balance.pretty()}
            key={i}
            percentage={percentage + '%'}
            txLink={`https://kovan.etherscan.io/token/${tokenAddress}?a=${address}`}
          />
        )
      })}
    </React.Fragment>
  )
}
