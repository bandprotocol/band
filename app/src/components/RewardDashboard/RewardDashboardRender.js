import React from 'react'
import { Flex, Text, Box } from 'ui/common'
import colors from 'ui/colors'

import RewardCard from 'components/RewardCard'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

export default ({ rewards, logedin, symbol, claimReward }) => (
  <Flex flexDirection="column" my={3}>
    <Text color={colors.purple.dark} fontSize={3} fontWeight="bold" pl={2}>
      Reward
    </Text>
    {rewards === null ? (
      <Box m="100px auto 0px auto">
        <CircleLoadingSpinner radius="60px" />
      </Box>
    ) : rewards.length === 0 ? (
      <Text textAlign="center" fontSize={3} pt={6} color={colors.purple.normal}>
        There is no reward.
      </Text>
    ) : (
      <Flex flexWrap="wrap" py={4}>
        {rewards.map(reward => (
          <RewardCard
            key={reward.rewardID}
            src={reward.imageLink}
            link={reward.detailLink}
            header={reward.header}
            total={`${reward.totalReward.pretty()} ${symbol}`}
            period={reward.period}
            logedin={logedin}
            amount={reward.amount && reward.amount.pretty()}
            claimed={reward.claimed}
            onClick={() => claimReward(reward.rewardID)}
          />
        ))}
      </Flex>
    )}
  </Flex>
)
