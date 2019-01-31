import React from 'react'

import HistoryBody from 'containers/HistoryBody'

import Select from 'react-select'
import {
  Flex,
  Text,
  BackgroundCard,
  H1,
  Button,
  Image,
  Box,
  H3,
  H4,
  AbsoluteLink,
  Link,
  Card,
} from 'ui/common'

import { colors } from 'ui'

const HistoryHeader = () => (
  <Flex flexDirection="row" py={3} bg="#f5f7ff" mt={3}>
    <Text pl="56.5px" color={colors.purple.dark} fontSize={0} fontWeight="bold">
      Time
    </Text>
    <Text pl="172px" color={colors.purple.dark} fontSize={0} fontWeight="bold">
      Price(BAND)
    </Text>
    <Text pl="73px" color={colors.purple.dark} fontSize={0} fontWeight="bold">
      Amount
    </Text>
    <Text pl="108px" color={colors.purple.dark} fontSize={0} fontWeight="bold">
      Type
    </Text>
  </Flex>
)

export default ({ options, selectedOption, onChange }) => (
  <Card
    variant="primary"
    height="560px"
    width="870px"
    bg="#fff"
    mx="auto"
    mt="10px"
    mb="10px"
    style={{ alignSelf: 'flex-start' }}
  >
    <Flex flexDirection="column" py={3}>
      <Flex flexDirection={'row'} alignItems="flex-start">
        <Text
          color={colors.purple.dark}
          fontSize={2}
          fontWeight="bold"
          p={3}
          pl={4}
        >
          Order History
        </Text>
        <Box ml="auto" mr={5} width="200px" mt={2}>
          <Select
            value={selectedOption}
            onChange={onChange}
            options={options}
          />
        </Box>
      </Flex>
      <HistoryHeader />
      <HistoryBody
        communityName="CoinHatcher"
        isAll={selectedOption.value === 'all'}
      />
    </Flex>
  </Card>
)
