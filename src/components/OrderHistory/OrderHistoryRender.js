import React from 'react'

import HistoryBody from './HistoryBody'
import { OrderPagination } from 'components/Pagination'

import { Flex, Text, Box, Card } from 'ui/common'

import { colors } from 'ui'

const HistoryHeader = () => (
  <Flex
    flexDirection="row"
    py={3}
    bg="#f5f7ff"
    style={{ minHeight: '60px' }}
    alignItems="center"
  >
    <Flex pl="30px" flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Time
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Price(BAND)
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Amount
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
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
  communityAddress,
  currentPage,
  onChangePage,
  pageSize,
}) => {
  return (
    <Flex
      style={{ borderRadius: '10px' }}
      width={1}
      bg="white"
      flexDirection="column"
      pb={3}
    >
      <HistoryHeader />
      <HistoryBody
        communityAddress={communityAddress}
        isAll={selectedOption.value === 'all'}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <OrderPagination
        communityAddress={communityAddress}
        isAll={selectedOption.value === 'all'}
        pageSize={pageSize}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    </Flex>
  )
}
