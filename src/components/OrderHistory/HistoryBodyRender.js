import React from 'react'

import { colors } from 'ui'
import { Flex, Text, AbsoluteLink, Image, Bold } from 'ui/common'
import OutImg from 'images/out.svg'

const HistoryRow = ({ index, time, price, amount, type, txLink }) => (
  <Flex
    flexDirection="row"
    style={{ minWidth: 0, overflow: 'hidden', height: '60px' }}
    bg={index % 2 === 0 ? 'white' : '#f9fbff'}
    alignItems="center"
  >
    <Flex flex={1} ml="30px">
      <Text color={colors.text} fontSize={0} letterSpacing="0.5px">
        {time}
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color={colors.text} fontSize={0}>
        {price}
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Text color={colors.text} fontSize={0}>
        {amount}
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Bold color={type === 'Buy' ? colors.green : colors.red} fontSize={0}>
        {type}
      </Bold>
    </Flex>
    <Flex flex={1} justifyContent="center">
      <AbsoluteLink href={txLink}>
        <Image src={OutImg} width="14px" height="14px" />
      </AbsoluteLink>
    </Flex>
  </Flex>
)

export default ({ items }) =>
  console.log(items) || (
    <React.Fragment>
      {items.map((item, i) => {
        if (!item) {
          return <Flex width={1} key={i} style={{ height: '60px' }} />
        }
        const { time, price, amount, type, txHash } = item
        return (
          <HistoryRow
            index={i}
            time={time.formal()}
            price={price.pretty()}
            amount={amount.pretty()}
            type={type}
            key={i}
            txLink={`https://rinkeby.etherscan.io/tx/${txHash}`}
          />
        )
      })}
    </React.Fragment>
  )
