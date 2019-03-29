import React from 'react'

import { OrderPagination } from 'components/Pagination'
import TransferBody from './TransferBody'

import { Flex, Text, Box } from 'ui/common'
import { colors } from 'ui'

const TransferHistoryHeader = () => (
  <Flex
    flexDirection="row"
    py={3}
    bg="#f5f7ff"
    style={{ minHeight: '60px' }}
    alignItems="center"
  >
    <Flex pl="30px" flex={4}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        From
      </Text>
    </Flex>
    <Flex flex={4}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        To
      </Text>
    </Flex>
    <Flex flex={2}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Quantity
      </Text>
    </Flex>
    <Flex flex={4}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Timestamp
      </Text>
    </Flex>
    <Flex flex={4}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        TxHash
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({
  options,
  communityAddress,
  currentPage,
  onChangePage,
  pageSize,
}) => {
  return (
    <Flex
      style={{ borderRadius: '10px', textOverflow: 'ellipsis' }}
      width={1}
      bg="white"
      flexDirection="column"
      pb={3}
    >
      <TransferHistoryHeader />
      <TransferBody
        communityAddress={communityAddress}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <OrderPagination
        communityAddress={communityAddress}
        //isAll={selectedOption.value === 'all'}
        pageSize={pageSize}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    </Flex>
  )
}
