import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Image } from 'ui/common'
import ProposalDetail from 'components/ProposalDetail'
import ParticipationStatus from 'components/ParticipationStatus'
import YourVote from 'components/YourVote'
import colors from 'ui/colors'
import CorrectCircle from 'images/correct-circle.svg'
import WrongCircle from 'images/wrong-circle.svg'

import BN from 'utils/bignumber'

import { convertFromChain, getParameterDetail } from 'utils/helper'

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
      bg={colors.blue.dark}
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
      width="100%"
      flexDirection="column"
      mb="20px"
      style={{
        borderRadius: '8px',
        border: 'solid 1px #dee2f0',
        overflow: 'hidden',
      }}
    >
      <Flex
        flexDirection="column"
        justifyContent="center"
        bg="#dee2f0"
        flex={1}
        px="40px"
        style={{
          lineHeight: '50px',
        }}
        onClick={() => toggleShow()}
      >
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left */}
          <Flex alignItems="center">
            <Text
              color={colors.blue.dark}
              fontSize={1}
              width="80px"
              fontWeight="400"
            >
              {'#' + prefix}
            </Text>
            <Text
              color={colors.text.normal}
              fontSize={1}
              px={2}
              fontWeight="500"
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '450px',
                lineHeight: '20px',
              }}
            >
              {title}
            </Text>
            {vote !== 'NOT VOTED' ? <VotedOval /> : null}
          </Flex>
          {/* Right */}
          <Flex flexDirection="row" justifyContent="center">
            {isActive ? (
              <React.Fragment>
                <Text
                  color={colors.blue.normal}
                  fontSize={16}
                  fontWeight="regular"
                  textAlign="right"
                  px={0}
                  mr="10px"
                >
                  Expiry date:
                </Text>
                <Text
                  color={colors.text.normal}
                  fontSize={16}
                  fontWeight="regular"
                  textAlign="right"
                  px={0}
                  mr="10px"
                >
                  {expiredAt.formal()}
                </Text>
              </React.Fragment>
            ) : (
              <Flex alignItems="center" mr="20px" justifyContent="flex-end">
                <Flex mr="13px">
                  {status === 'APPROVED' ? (
                    <Image src={CorrectCircle} width="18px" height="18px" />
                  ) : (
                    <Image src={WrongCircle} width="18px" height="18px" />
                  )}
                </Flex>
                <Text
                  color={status === 'APPROVED' ? '#42c47f' : '#ff6757'}
                  fontSize={16}
                  fontWeight="500"
                  textAlign="right"
                >
                  {status === 'APPROVED' ? 'Support' : 'Rejected'}
                </Text>
              </Flex>
            )}
            <Text
              fontSize={16}
              fontWeight="bold"
              textAlign="right"
              color={colors.purple.dark}
            >
              {show ? (
                <i className="fas fa-angle-up" />
              ) : (
                <i className="fas fa-angle-down" />
              )}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <FlexDropDown
        flexDirection="column"
        px="40px"
        show={show}
        bg="white"
        py={show && 4}
      >
        <Flex
          flexDirection="column"
          bg={colors.background.paleGrey}
          py="22px"
          px={4}
          style={{ borderRadius: '6px' }}
        >
          <Text fontWeight="500" color={colors.blue.dark} fontSize={1}>
            Reason for Change
          </Text>
          <Flex mt="20px">
            <Text fontSize={0} color={colors.text.normal} lineHeight={1.43}>
              {reason}
            </Text>
          </Flex>
          <Flex mt="20px">
            <Flex mr="10px">
              <Text fontSize={0} fontWeight="500" color={colors.blue.dark}>
                By:
              </Text>
            </Flex>
            <Flex mr="10px">
              <Text fontSize={14} fontWeight="500">
                {proposer}
              </Text>
            </Flex>
            <Flex>
              <Text fontSize={12} fontWeight="300">
                {proposedAt.pretty()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          mt="20px"
          flexDirection="column"
          bg={colors.background.paleGrey}
          px={4}
          style={{ borderRadius: '6px' }}
        >
          {changes.map(change => {
            const { type, description } = getParameterDetail(change.name)
            const [currentValue, currentUnit] = convertFromChain(
              change.oldValue,
              type,
            )
            const [changeValue, changeUnit] = convertFromChain(
              change.newValue,
              type,
            )
            return (
              <ProposalDetail
                key={`${proposalId}-${change.name}`}
                title={change.name}
                description={description}
                current={`${currentValue} ${currentUnit}`}
                changeTo={`${changeValue} ${changeUnit}`}
              />
            )
          })}

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
                100 -
                supportRequiredPct.div(new BN(10).pow(new BN(16))).toNumber()
              }
            />
          )}
        </Flex>
      </FlexDropDown>
    </Flex>
  )
}
