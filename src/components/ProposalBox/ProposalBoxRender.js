import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import ProposalDetail from 'components/ProposalDetail'
import ParticipationStatus from 'components/ParticipationStatus'
import YourVote from 'components/YourVote'
import Oval from 'components/Oval'
import colors from 'ui/colors'
import { hidden } from 'ansi-colors'

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
      style={{ 'border-radius': '10px', width: '50px', height: '18px' }}
    >
      <Text
        fontSize={12}
        px="5px"
        textAlign="center"
        style={{
          'font-style': 'oblique',
          color: 'white',
          'letter-spacing': '-0.2px',
        }}
      >
        Voted
      </Text>
    </Flex>
  </Flex>
)

export default ({
  title,
  show,
  toggleShow,
  isActive,
  isSupport,
  isVoted,
  status,
}) => {
  isSupport = Math.random() >= 0.5
  isVoted = Math.random() >= 0.5
  return (
    <Flex
      flex={1}
      flexDirection="column"
      mb="20px"
      style={{
        'border-radius': '4px',
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
            {title}
          </Text>
          <Text
            color={colors.text.normal}
            width={150 / 870}
            fontSize={16}
            fontWeight="regular"
          >
            Increase Reward
          </Text>
          {isVoted ? (
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
                28/01/2019 07:55
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
                  t={status === 'support' ? '✓' : '✕'}
                  color="white"
                  bg={status === 'support' ? '#42c47f' : '#ff6757'}
                  size="16"
                  fontSize={12}
                />
              </Flex>
              <Text
                color={status === 'support' ? '#42c47f' : '#ff6757'}
                width={150 / 870}
                fontSize={16}
                fontWeight="500"
                textAlign="right"
              >
                {status === 'support' ? 'Support' : 'Rejected'}
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
          description={
            'In an effort to promote better participation rate in our community, the development team has conducted an experiment which results in the proposing changes of parameters. We expect this change to increase voter participation rate by 12.8% according to our simulation.'
          }
          proposer={'Mike Ramos'}
          since={'25mins ago'}
        />
        <ProposalDetail
          title={'reward_percentage'}
          description={
            'The percentage of the reward pool in a challenge which is awarded to the winning party. Must be between 50% (the stake amount) to 100% (the total reward pool).'
          }
          current={'70%'}
          changeTo={'80%'}
        />
        <ProposalDetail
          title={'min_deposit'}
          description={
            'The number of tokens an operator must deposit for their application and for the duration of their position.'
          }
          current={'5000 CHT'}
          changeTo={'7000 CHT'}
        />
        <ProposalDetail
          title={'reveal_time'}
          description={
            'The duration in seconds during which token holders can reveal committed votes for a particular challenge.'
          }
          current={'7 days'}
          changeTo={'3 days'}
        />
        {(isActive || isVoted) && (
          <YourVote
            isVoted={isVoted}
            isSupport={isSupport}
            isActive={isActive}
          />
        )}
        <ParticipationStatus />
      </FlexDropDown>
    </Flex>
  )
}
