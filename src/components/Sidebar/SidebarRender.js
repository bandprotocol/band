import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Image, Flex, Text, Bold } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

// Images
import DetailSrc from 'images/detail.svg'
import RewardSrc from 'images/reward.svg'
import GovernanceSrc from 'images/governance.svg'
import ProposalSrc from 'images/vote.svg'

const Left = styled.div`
  width: 275px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: sticky;
  top: 80px;
  box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.05);
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
    <Flex ml={1} style={{ lineHeight: '15px' }}>
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
      <Image src={src} width="80px" height="80px" m={3} borderRadius="50%" />
      <Text
        py={1}
        fontSize={0}
        fontWeight={500}
        style={{ textTransform: 'uppercase' }}
      >
        {name}
      </Text>
      <Flex flexDirection="row" alignItems="flex-end" py={1}>
        {balance === undefined ? (
          <CircleLoadingSpinner radius="16px" />
        ) : (
          <React.Fragment>
            <Text color={colors.text.grey} fontSize={2}>
              {balance.pretty()}
            </Text>
            <HighlightSymbolOrUSD
              symbol={symbol}
              isSymbol={isSymbol}
              toggle={toggleBalance}
            />
          </React.Fragment>
        )}
      </Flex>
      <Flex flexDirection="column" py={5}>
        <Bold px={4} pb={3} fontSize={0}>
          MENU
        </Bold>
        <Flex
          flexDirection="row"
          alignItems="center"
          py={3}
          width="275px"
          pl={4}
          style={FocusStyle}
        >
          <Image src={DetailSrc} width="25px" height="25px" />
          <Text
            fontWeight="600"
            color={colors.purple.normal}
            px={3}
            fontSize={0}
          >
            Detail
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" py={3} pl={4}>
          <Image src={RewardSrc} width="25px" height="25px" />
          <Text color={colors.text} px={3} fontSize={0}>
            Reward
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" py={3} pl={4}>
          <Image src={GovernanceSrc} width="25px" height="25px" />
          <Text color={colors.text} px={3} fontSize={0}>
            Governance
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" py={3} px={4}>
          <Image src={ProposalSrc} width="25px" height="25px" />
          <Text color={colors.text} px={3} fontSize={0}>
            Proposal
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </Left>
)
