import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Image, Flex, Text } from 'ui/common'

// Images
import DetailSrc from 'images/detail.svg'
import RewardSrc from 'images/reward.svg'
import GovernanceSrc from 'images/governance.svg'
import ProposalSrc from 'images/vote.svg'

const Left = styled.div`
  width: 280px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: sticky;
  top: 80px;
`
const FocusStyle = {
  background: '#eaeeff',
  borderLeft: '4px solid #8868ff',
}

const TextClickable = styled(Text)`
  cursor: pointer;
`

const HighlightSymbolOrUSD = ({ symbol, isSymbol, toggle }) => {
  return (
    <Flex ml={1}>
      {isSymbol ? (
        <Text mr={0} fontWeight="bold" color="#8868ff" fontSize="11px">
          {symbol}
        </Text>
      ) : (
        <TextClickable
          color={colors.text.grey}
          onClick={toggle}
          fontSize="11px"
        >
          {symbol}
        </TextClickable>
      )}
      <Text px={0} color={colors.text.grey} fontSize="11px">
        /
      </Text>
      {isSymbol ? (
        <TextClickable
          color={colors.text.grey}
          onClick={toggle}
          fontSize="11px"
        >
          USD
        </TextClickable>
      ) : (
        <Text mr={0} fontWeight="bold" color="#8868ff" fontSize="11px">
          USD
        </Text>
      )}
    </Flex>
  )
}

export default ({ name, src, balance, symbol, isSymbol, toggleBalance }) => (
  <Left>
    <Flex flexDirection="column" alignItems="center" py={3}>
      <Image src={src} width="70px" height="70px" m={3} borderRadius="50%" />
      <Text py={1} color={colors.text.grey} fontSize="16px" fontWeight="bold">
        {name}
      </Text>
      <Flex flexDirection="row" alignItems="center" py={1}>
        {balance !== undefined ? (
          <Text color={colors.text.grey} fontSize={2}>
            {balance.pretty()}
          </Text>
        ) : null}
        <HighlightSymbolOrUSD
          symbol={symbol}
          isSymbol={isSymbol}
          toggle={toggleBalance}
        />
      </Flex>
      <Flex flexDirection="column" py={5}>
        <Text fontWeight="bold" px={4} pb={3}>
          MENU
        </Text>
        <Flex
          flexDirection="row"
          alignItems="center"
          py={3}
          width="275px"
          pl={4}
          style={FocusStyle}
        >
          <Image src={DetailSrc} width="25px" height="25px" />
          <Text fontWeight="bold" color={colors.purple.normal} px={3}>
            Detail
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" py={3} pl={4}>
          <Image src={RewardSrc} width="25px" height="25px" />
          <Text color={colors.text} px={3}>
            Reward
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" py={3} pl={4}>
          <Image src={GovernanceSrc} width="25px" height="25px" />
          <Text color={colors.text} px={3}>
            Governance
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" py={3} px={4}>
          <Image src={ProposalSrc} width="25px" height="25px" />
          <Text color={colors.text} px={3}>
            Proposal
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </Left>
)
