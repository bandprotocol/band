import React from 'react'

import HistoryBody from 'components/HistoryBody'
import { OrderPagination } from 'components/Pagination'

import Select from 'react-select'
import { Flex, Text, Box, Card } from 'ui/common'

import { colors } from 'ui'

const HistoryHeader = () => (
  <Flex flexDirection="row" py={3} bg="#f5f7ff" mt={3}>
    <Box flex="0 0 270px" pl="55px">
      <Text color={colors.purple.dark} fontSize={0} fontWeight="bold">
        Time
      </Text>
    </Box>
    <Box flex="0 0 160px">
      <Text color={colors.purple.dark} fontSize={0} fontWeight="bold">
        Price(BAND)
      </Text>
    </Box>
    <Box flex="0 0 160px">
      <Text color={colors.purple.dark} fontSize={0} fontWeight="bold">
        Amount
      </Text>
    </Box>
    <Flex flex={1}>
      <Text color={colors.purple.dark} fontSize={0} fontWeight="bold">
        Type
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({
  options,
  selectedOption,
  onChange,
  communityName,
  currentPage,
  onChangePage,
  pageSize,
}) => (
  <Card
    variant="detail"
    bg="#fff"
    mx="auto"
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
            isSearchable={false}
          />
        </Box>
      </Flex>
      <HistoryHeader />
      <HistoryBody
        communityName={communityName}
        isAll={selectedOption.value === 'all'}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <OrderPagination
        communityName={communityName}
        isAll={selectedOption.value === 'all'}
        pageSize={pageSize}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    </Flex>
  </Card>
)
