import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button } from 'ui/common'
import colors from 'ui/colors'
import ProposalBox from 'components/ProposalBox'
import Oval from 'components/Oval'

export default ({ description, proposals, isActive, title }) => (
  <Flex flexDirection="column" my={3} flex={1}>
    <Flex flexDirection="row">
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mr="10px"
      >
        <Text color={colors.purple.normal} fontSize={2} fontWeight="bold">
          {title}
        </Text>
      </Flex>
      <Flex flexDirection="column" justifyContent="center">
        <Oval t={proposals.length} />
      </Flex>
    </Flex>
    <Text color={colors.text.grey} fontSize={1} fontWeight="regular" my={3}>
      {description}
    </Text>
    <Flex flexDirection="column" mt="30px">
      {proposals.map(proposal => {
        return (
          <Flex>
            <ProposalBox
              title={proposal.title}
              isActive={isActive}
              status={Math.random() >= 0.5 ? 'support' : 'rejected'}
            />
          </Flex>
        )
      })}
    </Flex>
  </Flex>
)
