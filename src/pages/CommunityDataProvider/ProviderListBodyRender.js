import React from 'react'
import styled from 'styled-components'
import { colors } from 'ui'
import { Flex, Text, Button, Image, AbsoluteLink } from 'ui/common'
import { getProvider } from 'data/Providers'
import OutImg from 'images/out.svg'
import ArrowUp from 'images/arrowUp.svg'
import ArrowDown from 'images/arrowDown.svg'

const Tab = styled(Flex).attrs(props => ({
  letterSpacing: '0.5px',
  px: '10px',
}))`
  min-width: 0;
`

const DWButton = styled(Button).attrs({
  fontSize: '14px',
})`
  width: 95px;
  max-width: 95px;
  padding: 10px 5px;
  border-radius: 17.5px;
  cursor: ${props => (props.user ? 'pointer' : 'default')};
  background-color: ${props => (props.user ? props.bg : '#e3e6ef')};
  color: white;
  transition: all 0.25s;

  ${props =>
    props.user &&
    `&:hover {
      box-shadow: 0 3px 3px 0 ${props.hoverShadowColor};
  }`}

  ${props =>
    props.user &&
    `&:active {
      box-shadow: 0 0px 0px 0 ${props.color};
      background-color: ${props.activeColor};
  }`}
`

const ProvidersRow = ({
  user,
  rank,
  detail,
  dataSourceAddress,
  tcdAddress,
  ownerStake,
  userStake,
  userOwnership,
  totalOwnership,
  stake,
  status,
  showDepositWithdraw,
  txLink,
}) => (
  <Flex
    flexDirection="row"
    style={{
      minWidth: 0,
      overflow: 'hidden',
      height: '60px',
      borderLeft: status === 'LISTED' ? '8px solid #718bff' : 'none',
      borderBottom: '1px solid rgba(227, 227, 227, 0.5)',
    }}
    bg={status === 'LISTED' ? '#f9fbff' : 'white'}
    alignItems="center"
  >
    <Tab width={status === 'LISTED' ? '45px' : '60px'} justifyContent="center">
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
        {dataSourceAddress}
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
        {ownerStake.pretty()}
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
        {stake.pretty()}
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
        {userStake.pretty()}
      </Text>
    </Tab>
    <Flex flex={25} flexDirection="row" justifyContent="flex-end" pr="30px">
      <DWButton
        user={user}
        bg="#42c47f"
        color="#24bf97"
        hoverShadowColor="#a6e7c4"
        activeColor="#d2efeb"
        onClick={() =>
          user &&
          showDepositWithdraw(
            'DEPOSIT',
            tcdAddress,
            dataSourceAddress,
            userOwnership,
            stake,
            totalOwnership,
          )
        }
      >
        <Flex
          flexDirection="row"
          style={{ maxHeight: '35px' }}
          justifyContent="center"
        >
          {user && (
            <Flex>
              <Image src={ArrowDown} width="14px" height="14px" />
            </Flex>
          )}{' '}
          <Flex>Deposit</Flex>
        </Flex>
      </DWButton>
      <Flex mx="10px" />
      <DWButton
        user={user}
        bg="#ec6363"
        hoverShadowColor="#ffb4ac"
        activeColor="#f4e1e1"
        color="#ec6363"
        onClick={() =>
          user &&
          showDepositWithdraw(
            'WITHDRAW',
            tcdAddress,
            dataSourceAddress,
            userOwnership,
            stake,
            totalOwnership,
          )
        }
      >
        <Flex
          flexDirection="row"
          style={{ maxHeight: '35px' }}
          justifyContent="center"
        >
          {user && (
            <Flex>
              <Image src={ArrowUp} width="14px" height="14px" />{' '}
            </Flex>
          )}
          <Flex>Withdraw</Flex>
        </Flex>
      </DWButton>
    </Flex>
  </Flex>
)

export default ({ user, items, showDepositWithdraw }) => {
  return (
    <React.Fragment>
      {items.map((item, i) => {
        if (!item) {
          return <Flex width={1} key={i} style={{ height: 48 }} />
        }
        const {
          rank,
          tcdAddress,
          dataSourceAddress,
          ownerStake,
          stake,
          userStake,
          totalOwnership,
          userOwnership,
          status,
        } = item
        return (
          <ProvidersRow
            user={user}
            key={i}
            detail={getProvider(dataSourceAddress.toLowerCase())}
            rank={rank}
            dataSourceAddress={dataSourceAddress}
            tcdAddress={tcdAddress}
            ownerStake={ownerStake}
            userStake={userStake}
            userOwnership={userOwnership}
            stake={stake}
            status={status}
            totalOwnership={totalOwnership}
            showDepositWithdraw={showDepositWithdraw}
            txLink={`https://rinkeby.etherscan.io/address/${dataSourceAddress}`}
          />
        )
      })}
    </React.Fragment>
  )
}
