import React from 'react'
import { getLink } from 'utils/etherscan'
import { colors } from 'ui'
import { Flex, Text, AbsoluteLink, Image, Bold } from 'ui/common'
import OutImg from 'images/out.svg'

const HistoryRow = ({ index, time, price, amount, type, txLink }) => (
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
    <Flex flex={1} ml="10px">
      <Text color={colors.text} fontSize={0} letterSpacing="0.5px">
        {time}
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text fontFamily="code" color={colors.text} fontSize={0}>
        {price}
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Text fontFamily="code" color={colors.text} fontSize={0}>
        {amount}
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Bold color={type === 'Buy' ? colors.green : colors.red} fontSize={0}>
        {type}
      </Bold>
    </Flex>
    <Flex flex={0.9} justifyContent="center">
      <AbsoluteLink href={txLink}>
        <Image src={OutImg} width="14px" height="14px" />
      </AbsoluteLink>
    </Flex>
  </Flex>
)

export default ({ items }) => (
  <React.Fragment>
    {items.map((item, i) => {
      if (!item) {
        return <Flex width={1} key={i} style={{ height: 48 }} />
      }
      const { time, price, amount, type, txHash } = item
      return (
        <HistoryRow
          index={i}
          time={time.formal()}
          price={price}
          amount={amount.pretty()}
          type={type}
          key={i}
          txLink={`${getLink()}/tx/${txHash}`}
        />
      )
    })}
  </React.Fragment>
)
