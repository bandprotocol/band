import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Flex, Box, Text, Card, Image, Button, Heading } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import PageContainer from 'components/PageContainer'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import { createLoadingButton } from 'components/BaseButton'
import {
  LotteryCountByTypeFetcher,
  LotteryByTypeFetcher,
  LotteryProvidersByTypeTimeFetcher,
} from 'data/fetcher/LotteryFetcher'
import LotteryTable from 'components/table/LotteryTable'
import DatasetTab from 'components/DatasetTab'
import Loading from 'components/Loading'

import MmnSrc from 'images/dataset-megamillions.png'
import PwbSrc from 'images/dataset-powerball.png'

export default props => (
  <PageStructure
    renderHeader={() => (
      <Flex alignItems="center" justifyContent="center" flexDirection="column">
        <Text fontSize="36px" fontWeight="900">
          Lottery
        </Text>
        <Text fontSize="20px" mt={3}>
          Get winning numbers of lotteries all around the world
        </Text>
      </Flex>
    )}
    {...props}
  >
    <PageContainer>
      <Card>Hi</Card>
    </PageContainer>
  </PageStructure>
)
