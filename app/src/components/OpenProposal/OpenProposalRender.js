import React from 'react'
import styled from 'styled-components'
import colors from 'ui/colors'
import { Flex, Text } from 'rebass'

import ProposalItem from 'components/ProposalItem'

const CircleBadge = styled.span`
  display: block;
  border-radius: 50%;
  display: block;
  height: 25px;
  width: 25px;
  line-height: 25px;
  text-align: center;
  background-color: #e7ecff;
  color: ${colors.purple.normal};
  font-weight: 600;
  font-size: 14px;
`
export default ({ proposals }) => (
  <Flex flexDirection="column" my={3}>
    <Flex alignItems="center">
      <Text fontSize={2} fontWeight="bold" mr={2} color={colors.purple.normal}>
        Open Proposal
      </Text>
      <CircleBadge>{proposals.length}</CircleBadge>
    </Flex>
    <Text mt={3} color={colors.text.grey} fontSize={1}>
      Recently proposed change in governance parameter. Please vote before each
      proposal expires.
    </Text>
    <ProposalItem
      prefix="Admin"
      title="Increase reward"
      expiryDate="28/01/2019 07:55"
    />
  </Flex>
)
