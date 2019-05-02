import React from 'react'
import styled from 'styled-components'
import { colors } from 'ui'
import { Flex, Text, Button, Image, AbsoluteLink } from 'ui/common'
import OutImg from 'images/out.svg'

const Tab = styled(Flex).attrs({
  letterSpacing: '0.5px',
  px: '10px',
})`
  min-width: 0;
`

const HistoryRow = ({
  index,
  rank,
  detail,
  address,
  ownerStake,
  userStake,
  stake,
  showDW,
  txLink,
}) => (
  <Flex
    flexDirection="row"
    style={{
      minWidth: 0,
      overflow: 'hidden',
      height: '60px',
      borderLeft: rank <= 5 ? '8px solid #a2b0ea' : 'none',
      borderBottom: '1px solid rgba(227, 227, 227, 0.5)',
    }}
    bg={index % 2 === 0 ? 'white' : '#f9fbff'}
    alignItems="center"
  >
    <Tab width={rank <= 5 ? '45px' : '60px'} justifyContent="center">
      <Text color={colors.text} fontSize="14px">
        {rank}
      </Text>
    </Tab>
    <Tab flex={19}>
      <Text
        color={colors.text}
        fontSize="14px"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {detail}
      </Text>
    </Tab>
    <Tab flex={19} style={{ position: 'relative' }}>
      <Text
        color={colors.text}
        fontSize="14px"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {address}
      </Text>
      <AbsoluteLink href={txLink}>
        <Image
          style={{ position: 'absolute' }}
          src={OutImg}
          width="14px"
          height="14px"
        />
      </AbsoluteLink>
    </Tab>
    <Tab flex={16} justifyContent="center">
      <Text
        color={colors.text}
        fontSize="14px"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {ownerStake}
      </Text>
    </Tab>
    <Tab flex={16} justifyContent="center">
      <Text
        color={colors.text}
        fontSize="14px"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {stake}
      </Text>
    </Tab>
    <Tab flex={16} justifyContent="center">
      <Text
        color={colors.text}
        fontSize="14px"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {userStake}
      </Text>
    </Tab>
    <Flex flex={25} flexDirection="row" justifyContent="flex-end" pr="30px">
      <Button
        style={{ width: '95px', maxWidth: '95px', padding: '5px' }}
        bg="#dcf5f1"
        color="#24bf97"
        fontSize="14px"
        onClick={() => showDW('DEPOSIT', address)}
      >
        ↑ Deposit
      </Button>
      <Flex mx="10px" />
      <Button
        style={{ width: '95px', maxWidth: '95px', padding: '10px 5px' }}
        bg="#feefef"
        color="#ec6363"
        fontSize="14px"
        onClick={() => showDW('WITHDRAW', address)}
      >
        ↓ Withdraw
      </Button>
    </Flex>
  </Flex>
)

export default ({ items, showDW }) => {
  return (
    <React.Fragment>
      {items.map((item, i) => {
        if (!item) {
          return <Flex width={1} key={i} style={{ height: '60px' }} />
        }
        const {
          rank,
          dataSourceAddress,
          detail,
          ownerStake,
          stake,
          userStake,
        } = item
        return (
          <HistoryRow
            key={i}
            index={i}
            detail={detail}
            rank={rank}
            address={dataSourceAddress}
            ownerStake={ownerStake.pretty()}
            userStake={userStake.pretty()}
            stake={stake.pretty()}
            showDW={showDW}
            txLink={`https://rinkeby.etherscan.io/address/${dataSourceAddress}`}
          />
        )
      })}
    </React.Fragment>
  )
}
