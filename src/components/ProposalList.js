import React from 'react'
import { connect } from 'react-redux'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'
import ProposalBox from 'components/ProposalBox'
import Oval from 'components/Oval'

import { proposalByStatusSelector } from 'selectors/proposal'

const ProposalList = ({ description, proposals, isActive, title }) => (
  <Flex flexDirection="column" my={3} width="100%">
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
            <ProposalBox {...proposal} isActive={isActive} />
          </Flex>
        )
      })}
    </Flex>
  </Flex>
)

const mapStateToProps = (state, { communityAddress, isActive }) => ({
  proposals: proposalByStatusSelector(state, {
    address: communityAddress,
    type: isActive,
  }),
})

export default connect(mapStateToProps)(ProposalList)
