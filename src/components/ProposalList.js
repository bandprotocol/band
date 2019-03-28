import React from 'react'
import { connect } from 'react-redux'
import { Flex, Text, Box } from 'ui/common'
import colors from 'ui/colors'
import ProposalBox from 'components/ProposalBox'

import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import ToolTip from 'components/ToolTip'

import { proposalByStatusSelector } from 'selectors/proposal'

const ProposalList = ({ description, proposals, isActive, title }) => (
  <Flex flexDirection="column" my={3} width="100%">
    <Flex flexDirection="row">
      <Flex justifyContent="center" alignItems="center">
        <Text color={colors.text.normal} fontSize={4} fontWeight="bold" mr={3}>
          {`${title} (${proposals ? proposals.length : 0})`}
        </Text>
        {description && (
          <ToolTip
            bg={colors.text.grey}
            width="410px"
            textBg="#b2b6be"
            textColor={colors.text.normal}
            bottom={20}
            left={20}
            tip={{ left: 21 }}
          >
            {description}
          </ToolTip>
        )}
      </Flex>
    </Flex>
    {!proposals ? (
      <Box m="100px auto 0px auto">
        <CircleLoadingSpinner radius="60px" />
      </Box>
    ) : (
      <Flex flexDirection="column" mt="30px">
        {proposals.map(proposal => {
          return (
            <Flex>
              <ProposalBox {...proposal} isActive={isActive} />
            </Flex>
          )
        })}
      </Flex>
    )}
  </Flex>
)

const mapStateToProps = (state, { communityAddress, isActive }) => ({
  proposals: proposalByStatusSelector(state, {
    address: communityAddress,
    type: isActive,
  }),
})

export default connect(mapStateToProps)(ProposalList)
