import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button } from 'ui/common'

import { connect } from 'react-redux'
import { voteProposal } from 'actions'
import { withRouter } from 'react-router-dom'
import colors from 'ui/colors'

function hexToRGB(h, alpha) {
  const r = parseInt(h.slice(1, 3), 16)
  const g = parseInt(h.slice(3, 5), 16)
  const b = parseInt(h.slice(5, 7), 16)

  return `rgba(${r},${g},${b},${alpha})`
}

const VoteButton = styled(Button)`
  ${props =>
    props.selected
      ? `
      border: solid 1px ${props.colorVote};
      background-color: ${hexToRGB(props.colorVote, 0.1)};
      cursor: default;
      color:${props.colorVote};
      font-weight: 300;
    `
      : `
      box-shadow: 0 3px 3px 0 ${props.colorShadow};
      background-color: ${props.colorVote};
      color: white;
      cursor: pointer;
      font-weight: 500;
      `}

  font-size: 14px;
  border-radius: 6px;
  width: 135px;
  height: 35px;
`

const YourVote = ({ isSupport, isVoted, isActive, vote }) =>
  (isVoted || isActive) && (
    <Flex
      mt="20px"
      flexDirection="column"
      style={{
        borderBottom: isVoted ? '1px solid #cbcfe3' : 'none',
        minHeight: '100px',
      }}
    >
      <Text fontWeight="500" color={colors.purple.blueberry}>
        Your Vote:
      </Text>
      <Flex my="25px">
        {((isActive && !isVoted) || (!isSupport && isVoted)) && (
          <VoteButton
            selected={!isSupport && isVoted}
            colorVote="#ff6757"
            colorShadow="ffb4ac"
            onClick={() => vote(false)}
            mr="35px"
          >
            REJECT
          </VoteButton>
        )}
        {((isActive && !isVoted) || isSupport) && (
          <VoteButton
            selected={isSupport}
            colorVote="#42c47f"
            colorShadow="a6e7c4"
            onClick={() => vote(true)}
          >
            SUPPORT
          </VoteButton>
        )}
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
