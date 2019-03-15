import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import ProposalDetail from 'components/ProposalDetail'
import ParticipationStatus from 'components/ParticipationStatus'
import YourVote from 'components/YourVote'
import Oval from 'components/Oval'
import colors from 'ui/colors'

import BN from 'utils/bignumber'

import {
  convertFromChain,
  getParameterType,
  getUnitFromType,
} from 'utils/helper'

const FlexDropDown = styled(Flex)`
  overflow: hidden;
  transition: all 0.75s ease;
  ${props =>
    props.show
      ? 'max-height:5000px; opacity: 1;'
      : 'max-height:0px; opacity: 0;'}
`

const VotedOval = ({ width }) => (
  <Flex width={width}>
    <Flex
      bg={colors.purple.normal}
      flexDirection="column"
      justifyContent="center"
      style={{ borderRadius: '10px', width: '50px', height: '18px' }}
    >
      <Text
        fontSize={12}
        px="5px"
        textAlign="center"
        style={{
          fontStyle: 'oblique',
          color: 'white',
          letterSpacing: '-0.2px',
        }}
      >
        Voted
      </Text>
    </Flex>
  </Flex>
)

export default ({
  proposalId,
  prefix,
  expiredAt,
  title,
  reason,
  proposer,
  proposedAt,
  show,
  toggleShow,
  isActive,
  vote,
  status,
  changes,
  yesVote,
  noVote,
  minParticipation,
  supportRequiredPct,
  totalVotingPower,
}) => {
  const totalVote = yesVote.add(noVote)
  return (
    <Flex
      flex={1}
      flexDirection="column"
      mb="20px"
      style={{
        borderRadius: '4px',
        border: 'solid 1px ' + colors.background.lightGrey,
      }}
    >
      <Flex
        flexDirection="column"
        justifyContent="center"
        bg={colors.background.lightGrey}
        flex={1}
        px="40px"
        style={{ height: '50px' }}
        onClick={() => toggleShow()}
      >
        <Flex flexDirection="row">
          <Text
            color={colors.purple.normal}
            width={100 / 870}
            fontSize={16}
            fontWeight="regular"
          >
            {'#' + prefix}
          </Text>
          <Text
            color={colors.text.normal}
            width={150 / 870}
            fontSize={16}
            fontWeight="regular"
          >
            {title}
          </Text>
          {vote !== 'NOT VOTED' ? (
            <VotedOval width={300 / 870} />
          ) : (
            <Flex width={300 / 870}>{''}</Flex>
          )}
          {isActive ? (
            <React.Fragment>
              <Text
                color={colors.purple.normal}
                width={150 / 870}
                fontSize={16}
                fontWeight="regular"
                textAlign="right"
              >
                Expiry date:
              </Text>
              <Text
                color={colors.text.normal}
                width={150 / 870}
                fontSize={16}
                fontWeight="regular"
                textAlign="right"
              >
                {expiredAt.formal()}
              </Text>
            </React.Fragment>
          ) : (
            <Flex
              width={300 / 870}
              alignItems="center"
              mr="20px"
              justifyContent="flex-end"
            >
              <Flex mr="20px">
                <Oval
                  t={status === 'YES' ? '✓' : '✕'}
                  color="white"
                  bg={status === 'YES' ? '#42c47f' : '#ff6757'}
                  size="16"
                  fontSize={12}
                />
              </Flex>
              <Text
                color={status === 'YES' ? '#42c47f' : '#ff6757'}
                width={150 / 870}
                fontSize={16}
                fontWeight="500"
                textAlign="right"
              >
                {status === 'YES' ? 'Support' : 'Rejected'}
              </Text>
            </Flex>
          )}
          <Text
            width={30 / 870}
            fontSize={16}
            fontWeight="bold"
            textAlign="right"
            color={colors.purple.normal}
          >
            {show ? '^' : 'v'}
          </Text>
        </Flex>
      </Flex>
      <FlexDropDown flexDirection="column" px="40px" show={show}>
        <ProposalDetail
          title={'Reason for Change'}
          description={reason}
          proposer={proposer}
          since={proposedAt.pretty()}
        />
        {changes.map(change => (
          <ProposalDetail
            title={change.name}
            current={`${convertFromChain(
              change.oldValue,
              getParameterType(change.name),
            )} ${getUnitFromType(getParameterType(change.name))}`}
            changeTo={`${convertFromChain(
              change.newValue,
              getParameterType(change.name),
            )} ${getUnitFromType(getParameterType(change.name))}`}
          />
        ))}
        <YourVote
          isVoted={vote !== 'NOT VOTED'}
          isSupport={vote === 'SUPPORT'}
          isActive={isActive}
          proposalId={proposalId}
        />
        {(!isActive || vote !== 'NOT VOTED') && (
          <ParticipationStatus
            percentParticipant={yesVote
              .add(noVote)
              .mul(new BN(100))
              .div(totalVotingPower)
              .toNumber()}
            percentReject={
              totalVote.eq(new BN(0))
                ? 100
                : noVote
                    .mul(new BN(100))
                    .div(totalVote)
                    .toNumber()
            }
            minParticipation={minParticipation
              .mul(new BN(100))
              .div(totalVotingPower)
              .toNumber()}
            supportRequiredPct={
              100 - supportRequiredPct.div(new BN(1e12)).toNumber()
            }
          />
        )}
      </FlexDropDown>
    </Flex>
  )
}
