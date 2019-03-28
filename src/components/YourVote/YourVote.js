import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button } from 'ui/common'

import { connect } from 'react-redux'
import { voteProposal } from 'actions'
import { withRouter } from 'react-router-dom'

const VoteButton = styled(Button)`
  ${props =>
    props.selected
      ? `
      border: 1px solid white;
      color: white;
      background-color: ${props.colorVote};
    `
      : `border: 1px solid ${props.colorVote};
    color: ${props.colorVote};
    background-color: white;`}

  ${props => (props.disabled ? ' opacity: 0.5;' : ' opacity: 1  ;')}
  ${props => (props.disabled ? 'cursor: default;' : 'cursor: pointer;')}

  font-weight: 500;
  font-size: 14px;
  border-radius: 6px;
  width: 135px;
  height: 35px;
`

const YourVote = ({ isSupport, isVoted, isActive, vote }) => (
  <Flex
    mt="20px"
    flexDirection="column"
    style={{ borderBottom: '1px solid #cbcfe3', minHeight: '100px' }}
  >
    <Text fontWeight="500">Your Vote:</Text>
    <Flex my="25px">
      <Flex mr="20px">
        <Flex mr="20px">
          <VoteButton
            selected={!isSupport && isVoted}
            colorVote="#fe4949"
            disabled={isVoted || !isActive}
            onClick={() => vote(false)}
          >
            REJECT
          </VoteButton>
        </Flex>
      </Flex>
      <Flex mr="20px">
        <Flex mr="20px">
          <VoteButton
            selected={isSupport}
            colorVote="#42c47f"
            disabled={isVoted || !isActive}
            onClick={() => vote(true)}
          >
            SUPPORT
          </VoteButton>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
)

const mapDispatchToProps = (dispatch, { match, proposalId }) => ({
  vote: isYes =>
    dispatch(voteProposal(match.params.community, proposalId, isYes)),
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(YourVote),
)
