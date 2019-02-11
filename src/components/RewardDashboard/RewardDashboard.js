import React from 'react'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'

import RewardCard from 'components/RewardCard'

export default ({ logined }) => (
  <Flex flexDirection="column" my={3}>
    <Text color={colors.purple.dark} fontSize={3} fontWeight="bold" pl={2}>
      Reward
    </Text>
    <Flex flexWrap="wrap" py={4}>
      <RewardCard
        src="https://i.imgur.com/Ygh4bRe.jpg"
        link="https://www.binance.com"
        header="January Reward"
        total="1,400 CHT"
        period="01/01/2019 - 31/01/2019"
        logined={logined}
      />
      <RewardCard
        src="https://i.imgur.com/S82cW5G.jpg"
        link="https://www.bx.in.th"
        header="Febuary Reward"
        total="1,100 CHT"
        period="01/02/2019 - 28/02/2019"
        logined={logined}
      />
      <RewardCard
        src="https://i.imgur.com/kdjRMUz.jpg"
        link="https://imgur.com/gallery/af3EEyG"
        header="March Reward"
        total="2,500 CHT"
        period="01/03/2019 - 31/03/2019"
        logined={logined}
      />
      <RewardCard
        src="https://i.imgur.com/4pZoInM.jpg"
        link="https://imgur.com/gallery/af3EEyG"
        header="April Reward"
        total="3,500 CHT"
        period="01/04/2019 - 30/04/2019"
        logined={logined}
        claimed
      />
      <RewardCard
        src="https://i.imgur.com/IEMPcrx.jpg"
        link="https://imgur.com/gallery/af3EEyG"
        header="May Reward"
        total="1,700 CHT"
        period="01/05/2019 - 31/05/2019"
        logined={logined}
      />
      <RewardCard
        src="https://i.imgur.com/ACPUcq8.jpg"
        link="https://imgur.com/gallery/af3EEyG"
        header="June Reward"
        total="2,900 CHT"
        period="01/06/2019 - 30/06/2019"
        logined={logined}
        claimed
      />
    </Flex>
  </Flex>
)
