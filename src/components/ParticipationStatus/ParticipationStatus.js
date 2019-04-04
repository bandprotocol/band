import React from 'react'
import colors from 'ui/colors'
import { Flex, Text } from 'ui/common'
import ProgressBar from 'components/ProgressBar'
import ToolTip from 'components/ToolTip'

export default ({
  percentParticipant,
  percentReject,
  minParticipation,
  supportRequiredPct,
}) => {
  return (
    <Flex my={4}>
      <Flex>
        <Flex flexDirection="column">
          <Flex alignItems="center" mb={3}>
            <Text fontWeight="500" mr={1} color={colors.purple.blueberry}>
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
              {`If less than ${minParticipation}% of all voting power participate,
              the proposal is canceled and no parameter changes will be applied.`}
            </ToolTip>
            <Text fontWeight="500" mx={2} color={colors.purple.blueberry}>
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
            <Text fontWeight="500" mr={1} color={colors.purple.blueberry}>
              Status
            </Text>{' '}
            : Minimum participation
            {percentParticipant < minParticipation ? ' unreached' : ' reached'}
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={1} />
      <Flex>
        <Flex flexDirection="column">
          <Flex alignItems="center" mb={3}>
            <Text fontWeight="500" mr={1} color={colors.purple.blueberry}>
              Result
            </Text>
            <ToolTip
              top={40}
              left={60}
              bg="#7c84a6"
              textBg="#b2b6be"
              textColor="#000000"
              tip={{ left: 61 }}
            >
              {`To approve a proposal, at least ${100 - supportRequiredPct}% of
              participating voting power is required.
              Otherwise the proposal will not be
              successful.`}
            </ToolTip>
            <Text fontWeight="500" mr={2} color={colors.purple.blueberry}>
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
            <Text fontWeight="500" mr={1} color={colors.purple.blueberry}>
              Status
            </Text>
            {percentReject < supportRequiredPct ? ': Approved' : ': Rejected'}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
