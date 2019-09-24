import React from 'react'
import { colors } from 'ui'
import { Flex, Text } from 'ui/common'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const HistoryRow = ({ rank, address, balance, percentage }) => (
  <Flex
    flexDirection="row"
    mx="30px"
    style={{
      minWidth: 0,
      overflow: 'hidden',
      height: '40px',
      borderBottom: 'solid 1px #eef3ff',
    }}
    alignItems="center"
  >
    <Flex
      flex={2}
      ml="10px"
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
      <Flex alignItems="center">
        {!!address && (
          <Jazzicon diameter={22} seed={jsNumberForAddress(address)} />
        )}
        <Text
          fontFamily="code"
          color={colors.text}
          fontSize={0}
          ml={2}
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {address}
        </Text>
      </Flex>
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
        const { rank, address, balance, percentage } = item
        return (
          <HistoryRow
            rank={rank}
            address={address}
            balance={balance.pretty()}
            key={i}
            percentage={percentage + '%'}
          />
        )
      })}
    </React.Fragment>
  )
}
