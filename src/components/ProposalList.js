import React from 'react'
import { connect } from 'react-redux'
import { Flex, Text, Box, Image, Link } from 'ui/common'
import colors from 'ui/colors'
import ProposalBox from 'components/ProposalBox'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import ToolTip from 'components/ToolTip'
import MockProposal from 'images/mock-proposal.svg'

import { proposalByStatusSelector } from 'selectors/proposal'

const ProposalList = ({
  tokenAddress,
  description,
  proposals,
  isActive,
  title,
}) => (
  <Flex flexDirection="column" my={3} width="100%">
    <Flex flexDirection="row">
      <Flex justifyContent="center" alignItems="center">
        <Text
          mr={3}
          fontFamily="head"
          fontSize="18px"
          fontWeight="900"
          color="#393939"
        >
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
    ) : proposals.length === 0 ? (
      isActive ? (
        <Flex flexDirection="column" mt="50px" alignItems="center">
          <Image src={MockProposal} />
          <Text
            fontFamily="head"
            fontSize="16=7px"
            fontWeight="600"
            pt={3}
            pb={2}
          >
            No active proposal!
          </Text>
          <Text fontSize="15px" py={2}>
            Go to
            <Link
              dark="true"
              to={`/community/${tokenAddress}/parameters`}
              px="5px"
              underline
            >
              Governance
            </Link>
            Page to propose the new change.
          </Text>
        </Flex>
      ) : null
    ) : (
      <Flex flexDirection="column" mt="30px">
        {proposals.map(proposal => (
          <ProposalBox
            key={proposal.proposalId}
            {...proposal}
            isActive={isActive}
          />
        ))}
      </Flex>
    )}
  </Flex>
)

const mapStateToProps = (state, { tokenAddress, isActive }) => ({
  proposals: proposalByStatusSelector(state, {
    address: tokenAddress,
    type: isActive,
  }),
  tokenAddress,
})

export default connect(mapStateToProps)(ProposalList)
