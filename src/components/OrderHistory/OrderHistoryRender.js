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
    <Flex ml="30px" flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Time
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Price(BAND)
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Amount
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Type
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({
  numOrders,
  selectedOption,
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
    >
      <HistoryHeader />
      {numOrders > 0 ? (
        <React.Fragment>
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
        </React.Fragment>
      ) : (
        <Flex
          width={1}
          justifyContent="center"
          alignItems="center"
          fontWeight={500}
          style={{ height: '600px' }}
        >
          No Data
        </Flex>
      )}
    </Flex>
  )
}
