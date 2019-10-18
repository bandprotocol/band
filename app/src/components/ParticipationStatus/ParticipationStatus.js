import React from 'react'
import { Flex, Text } from 'ui/common'
import ProgressBar from 'components/ProgressBar'
import ToolTip from 'components/ToolTip'
import { FormattedMessage } from 'react-intl'

export default ({
  percentParticipant,
  percentReject,
  minParticipation,
  supportRequiredPct,
}) => {
  return (
    <Flex
      my="20px"
      pr="40px"
      pl="20px"
      py="25px"
      width={1}
      bg="#fafbff"
      style={{ border: 'solid 1px #dde5ff', borderRadius: '6px' }}
    >
      <Flex flex={1}>
        <Flex flexDirection="column">
          <Flex alignItems="center" mb={3}>
            <Text fontWeight="500" mr={1} color="#5269ff">
              Participation
            </Text>
            <ToolTip
              top={40}
              left={60}
              bg="#7c84a6"
              textBg="#b2b6be"
              textColor="#000000"
              tip={{ left: 61 }}
            >
              <FormattedMessage
                id="tooltip.proposal.participation"
                values={{ minParticipation }}
              ></FormattedMessage>
            </ToolTip>
            <Text fontWeight="500" mx={2} color="#5269ff">
              :
            </Text>
            <ProgressBar
              percent={percentParticipant}
              isResult={false}
              minimum={minParticipation}
              pb={3}
              ml={2}
            />
          </Flex>
          <Flex>
            <Text fontWeight="500" mr={1} color="#5269ff">
              <FormattedMessage id="Status"></FormattedMessage>
            </Text>{' '}
            : <FormattedMessage id="Minimum participation"></FormattedMessage>{' '}
            {percentParticipant < minParticipation ? (
              <FormattedMessage id="unreached"></FormattedMessage>
            ) : (
              <FormattedMessage id="reached"></FormattedMessage>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={1} justifyContent="flex-end">
        <Flex flexDirection="column">
          <Flex alignItems="center" mb={3}>
            <Text fontWeight="500" mr={1} color="#5269ff">
              <FormattedMessage id="Result"></FormattedMessage>
            </Text>
            <ToolTip
              top={40}
              left={60}
              bg="#7c84a6"
              textBg="#b2b6be"
              textColor="#000000"
              tip={{ left: 61 }}
            >
              <FormattedMessage
                id="tooltip.proposal.result"
                values={{ num: 100 - supportRequiredPct }}
              ></FormattedMessage>
            </ToolTip>
            <Text fontWeight="500" mx={2} color="#5269ff">
              :
            </Text>
            <ProgressBar
              percent={percentReject}
              isResult={true}
              minimum={supportRequiredPct}
              pb={3}
              ml={2}
            />
          </Flex>
          <Flex>
            <Text fontWeight="500" mr={1} color="#5269ff">
              <FormattedMessage id="Status"></FormattedMessage>
            </Text>
            {': '}
            {percentReject < supportRequiredPct ? (
              <FormattedMessage id="Approved"></FormattedMessage>
            ) : (
              <FormattedMessage id="Rejected"></FormattedMessage>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
