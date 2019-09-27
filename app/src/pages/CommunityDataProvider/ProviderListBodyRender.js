import React from 'react'
import styled from 'styled-components'
import { colors } from 'ui'
import { Flex, Box, Text, Button, Image, AbsoluteLink } from 'ui/common'
import { getProvider } from 'data/Providers'
import { getLink } from 'utils/etherscan'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import OutImg from 'images/out.svg'
import ArrowUp from 'images/arrowUp.svg'
import ArrowDown from 'images/arrowDown.svg'

const Tab = styled(Flex).attrs(props => ({
  letterSpacing: '0.5px',
  px: '10px',
}))`
  min-width: 0;
`

const ExchangeButton = styled(FontAwesomeIcon)`
  color: gray;
  cursor: cursor;
  pointer-events: none;
  opacity: 0.2;
  margin-left: 10px;

  &:hover {
    transition: background-color 0.1s;
  }
  ${props =>
    props.haveRevenue &&
    `color: green;
    cursor: pointer;
    pointer-events: auto;
    opacity: 1;`}
`

const DWButton = styled(Button).attrs({
  flex: '0 0 auto',
})`
  border-radius: 17.5px;
  cursor: pointer;
  background-color: ${props => props.bg};
  pointer-events: auto;
  color: white;
  transition: all 0.25s;

  &:disabled {
    cursor: default;
    background-color: #e3e6ef;
    pointer-events: none;
  }

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
  showConvertRevenue,
  txLink,
  userRevenue,
  remainingToken,
}) => (
  <Flex
    flexDirection="row"
    style={{
      minWidth: 0,
      overflow: 'hidden',
      height: '60px',
      borderLeft: `6px solid ${status === 'ACTIVE' ? '#718bff' : '#fff'}`,
      backgroundColor: status === 'ACTIVE' ? '#fbfcff' : '#fff',
      borderBottom: '1px solid rgba(227, 227, 227, 0.5)',
    }}
    alignItems="center"
  >
    <Tab ml="17px" width="45px" justifyContent="center">
      <Text color="#5269ff" fontWeight="900" fontSize="14px">
        {rank}
      </Text>
    </Tab>
    <Tab flex={13} alignItems="center">
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
      <AbsoluteLink href={txLink}>
        <Image src={OutImg} width="14px" height="14px" ml={1} />
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
        {userStake.sub(userRevenue).pretty(6)}
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
        {userRevenue.pretty(6)}
      </Text>
      <ExchangeButton
        haveRevenue={userRevenue.pretty(6) > 0 ? 1 : 0}
        icon={faExchangeAlt}
        onClick={() =>
          showConvertRevenue(
            tcdAddress,
            dataSourceAddress,
            userRevenue,
            stake,
            totalOwnership,
          )
        }
      />
    </Tab>
    <Flex
      flex="0 0 265px"
      flexDirection="row"
      justifyContent="flex-end"
      pr="30px"
    >
      <DWButton
        disabled={!user || Number(remainingToken.pretty()) <= 0}
        bg="#42c47f"
        color="#24bf97"
        hoverShadowColor="#a6e7c4"
        activeColor="#d2efeb"
        onClick={() =>
          showDepositWithdraw(
            'DEPOSIT',
            tcdAddress,
            dataSourceAddress,
            userOwnership,
            userStake,
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
            Stake
          </Text>
        </Flex>
      </DWButton>
      <Flex mx="10px" />
      <DWButton
        disabled={!user || userStake.pretty() <= 0}
        bg="#ec6363"
        hoverShadowColor="#ffb4ac"
        activeColor="#f4e1e1"
        color="#ec6363"
        onClick={() =>
          showDepositWithdraw(
            'WITHDRAW',
            tcdAddress,
            dataSourceAddress,
            userOwnership,
            userStake,
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
            Unstake
          </Text>
        </Flex>
      </DWButton>
    </Flex>
  </Flex>
)

export default ({
  user,
  items,
  remainingToken,
  showDepositWithdraw,
  showConvertRevenue,
}) => {
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
          userRevenue,
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
            showConvertRevenue={showConvertRevenue}
            remainingToken={remainingToken}
            txLink={`${getLink()}/address/${dataSourceAddress}`}
            userRevenue={userRevenue}
          />
        )
      })}
    </React.Fragment>
  )
}
