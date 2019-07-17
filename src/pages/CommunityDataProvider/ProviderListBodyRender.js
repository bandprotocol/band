import React from 'react'
import styled from 'styled-components'
import { colors } from 'ui'
import { Flex, Box, Text, Button, Image, AbsoluteLink } from 'ui/common'
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
  p: '0 15px 2px',
  flex: '0 0 auto',
})`
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
  image,
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
      borderLeft: status === 'ACTIVE' ? '6px solid #718bff' : 'none',
      backgroundColor: status === 'ACTIVE' ? '#fbfcff' : '#fff',
      borderBottom: '1px solid rgba(227, 227, 227, 0.5)',
    }}
    alignItems="center"
  >
    <Tab
      ml="17px"
      width={status === 'ACTIVE' ? '45px' : '60px'}
      justifyContent="center"
    >
      <Text color="#5269ff" fontWeight="900" fontSize="14px">
        {rank}
      </Text>
    </Tab>
    <Tab flex={20} alignItems="center">
      <Box
        width="20px"
        mr={2}
        style={{
          height: '20px',
          backgroundImage: `url(${image})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
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
    <Tab flex={20} style={{ position: 'relative' }}>
      <Text
        color={colors.text}
        fontSize="14px"
        fontFamily="code"
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
          ml={1}
        />
      </AbsoluteLink>
    </Tab>
    <Tab flex={12} justifyContent="center">
      <Text
        color={colors.text}
        fontSize="14px"
        fontFamily="code"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {ownerStake.pretty()}
      </Text>
    </Tab>
    <Tab flex={12} justifyContent="center">
      <Text
        color={colors.text}
        fontSize="14px"
        fontFamily="code"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {stake.pretty()}
      </Text>
    </Tab>
    <Tab flex={12} justifyContent="center">
      <Text
        color={colors.text}
        fontSize="14px"
        fontFamily="code"
        style={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {userStake.pretty()}
      </Text>
    </Tab>
    <Flex
      flex="0 0 265px"
      flexDirection="row"
      justifyContent="flex-end"
      pr="30px"
    >
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
          alignItems="center"
        >
          {user && (
            <Box flex="0 0 auto">
              <Image mr={1} src={ArrowDown} width="12px" height="12px" />
            </Box>
          )}
          <Text fontFamily="head" fontSize="12px" fontWeight="700" pb={1}>
            Deposit
          </Text>
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
          alignItems="center"
        >
          {user && (
            <Box flex="0 0 auto">
              <Image mr={1} src={ArrowUp} width="12px" height="12px" />
            </Box>
          )}
          <Text fontFamily="head" fontSize="12px" fontWeight="700" pb={1}>
            Withdraw
          </Text>
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
            image={getProvider(dataSourceAddress).image}
            detail={getProvider(dataSourceAddress).name}
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
            txLink={`https://kovan.etherscan.io/address/${dataSourceAddress}`}
          />
        )
      })}
    </React.Fragment>
  )
}
