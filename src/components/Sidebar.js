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
`
const FocusStyle = {
  background: '#eaeeff',
  borderLeft: '4px solid #8868ff',
}

export default ({ name, src, balance, symbol }) => (
  <Left>
    <Flex flexDirection="column" alignItems="center" py={3}>
      <Image src={src} width="70px" height="70px" m={3} borderRadius="50%" />
      <Text py={1} color={colors.text.grey} fontSize="16px">
        {name}
      </Text>
      {balance !== undefined ? (
        <Text py={1}>
          {balance.pretty()} {symbol} / USD
        </Text>
      ) : null}
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
