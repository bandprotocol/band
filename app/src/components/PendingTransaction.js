import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text } from 'ui/common'
import TxHashLink from 'components/TxHashLink'
import { getLink } from 'utils/etherscan'

const Container = styled(Box).attrs({
  bg: '#ffffff',
  mb: 2,
  pl: 3,
})`
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.15);
  border-radius: 4;
`

const EllipsisText = styled(Text).attrs(props => ({
  color: '#4a4a4a',
  fontSize: '14px',
  lineHeight: '18px',
  mr: '10px',
}))`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Badge = styled(Text).attrs(props => ({
  flex: '0 0 84px',
  lineHeight: '25px',
  fontSize: '14px',
  textAlign: 'center',
  fontWeight: 600,
  bg: props.bg,
  color: props.color,
  ml: 3,
}))``

const TxType = ({ type }) => {
  switch (type) {
    case 'BUY':
      return (
        <Badge bg="#edffe7" color="#42c47f">
          Buy
        </Badge>
      )
    case 'SELL':
      return (
        <Badge bg="#ffe7e7" color="#ec6363">
          Sell
        </Badge>
      )
    case 'PROPOSE':
      return (
        <Badge bg="#e5e5e5" color="#4a4a4a">
          Propose
        </Badge>
      )
    case 'VOTE':
      return (
        <Badge bg="#ebefff" color="#4853ff">
          Vote
        </Badge>
      )
    case 'REWARD':
      return (
        <Badge bg="#edffe7" color="#42c47f">
          Claim
        </Badge>
      )
    case 'DEPOSIT':
      return (
        <Badge bg="#edffe7" color="#42c47f">
          Deposit
        </Badge>
      )
    case 'WITHDRAW':
      return (
        <Badge bg="#ffe7e7" color="#ec6363">
          Withdraw
        </Badge>
      )
    case 'REVENUE_TO_STAKE':
      return (
        <Badge bg="#edffe7" color="#42c47f">
          Deposit
        </Badge>
      )
    case 'CLAIM':
      return (
        <Badge bg="#edffe7" color="#42c47f">
          Claim
        </Badge>
      )
    default:
      return (
        <Badge bg="#ffe7e7" color="#ec6363">
          Default
        </Badge>
      )
  }
}

const renderStatus = (status, confirm) => {
  switch (status) {
    case 'WAIT_CONFIRM':
      return (
        <Flex pb={3} alignItems="center" pr={2}>
          <Box
            width="160px"
            bg="#e7ecff"
            style={{ height: '8px', borderRadius: '5px' }}
            mr={3}
          >
            <Box
              width={`${(confirm * 100) / 4}%`}
              bg="#4853ff"
              style={{
                height: '8px',
                borderRadius: '5px',
                transition: 'width 500ms',
              }}
            />
          </Box>
          <Flex>
            <Text fontSize={14} color="#4e3ca9">
              {confirm}
            </Text>
            <Text fontSize={14}>/4 Confirmation</Text>
          </Flex>
        </Flex>
      )
    case 'PENDING':
      return (
        <Flex pb={3} alignItems="center" pr={2}>
          <Text
            color="#4e3ca9"
            fontWeight={600}
            fontSize={14}
            style={{ fontStyle: 'italic' }}
          >
            Pending
          </Text>
        </Flex>
      )
    case 'SENDING':
      return (
        <Flex pb={3} alignItems="center" pr={2}>
          <Text
            color="#4e3ca9"
            fontWeight={600}
            fontSize={14}
            style={{ fontStyle: 'italic' }}
          >
            Sending
          </Text>
        </Flex>
      )
    case 'COMPLETED':
      return (
        <Flex pb={3} alignItems="center" pr={2}>
          <Text
            color="#42c47f"
            fontWeight={600}
            fontSize={14}
            style={{ fontStyle: 'italic' }}
          >
            Completed
          </Text>
        </Flex>
      )
    case 'FAILED':
      return (
        <Flex pb={3} alignItems="center" pr={2}>
          <Text
            color="#ec6363"
            fontWeight={600}
            fontSize={14}
            style={{ fontStyle: 'italic' }}
          >
            Failed
          </Text>
        </Flex>
      )
    default:
      return (
        <Flex pb={3} alignItems="center" pr={2}>
          <Text
            color="#ec6363"
            fontWeight={600}
            fontSize={14}
            style={{ fontStyle: 'italic' }}
          >
            Default
          </Text>
        </Flex>
      )
  }
}

export default ({ title, type, txHash, status, confirm }) => (
  <Container>
    <Flex py={3}>
      <Flex flex={1} style={{ minWidth: 0 }}>
        <EllipsisText>{title}</EllipsisText>
        {txHash && <TxHashLink href={`${getLink()}/tx/${txHash}`} />}
      </Flex>
      <TxType type={type} />
    </Flex>
    {renderStatus(status, confirm)}
  </Container>
)
