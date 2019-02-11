import React from 'react'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'

import RewardCard from 'components/RewardCard'

export default ({ rewards, logedin, symbol, claimReward }) => (
  <Flex flexDirection="column" my={3}>
    <Text color={colors.purple.dark} fontSize={3} fontWeight="bold" pl={2}>
      Reward
    </Text>
    <Flex flexWrap="wrap" py={4}>
      {rewards.map(reward => (
        <RewardCard
          key={reward.rewardID}
          src="https://i.imgur.com/Ygh4bRe.jpg"
          link="https://www.binance.com"
          header="January Reward"
          total={`${reward.totalReward.pretty()} ${symbol}`}
          period="01/01/2019 - 31/01/2019"
          logedin={logedin}
          amount={reward.amount.pretty()}
          claimed={reward.claimed}
          onClick={() => claimReward(reward.rewardID)}
        />
      ))}
    </Flex>
  </Flex>
)
