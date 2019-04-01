import React from 'react'

import TransferPagination from 'components/Pagination/TransferPagination'
import TransferBody from './TransferBody'

import { Flex, Text } from 'ui/common'

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
    <Flex flex={3}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Quantity
      </Text>
    </Flex>
    <Flex flex={3}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Timestamp
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({ communityAddress, currentPage, onChangePage, pageSize }) => {
  return (
    <Flex
      style={{ borderRadius: '10px' }}
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
      <TransferPagination
        communityAddress={communityAddress}
        pageSize={pageSize}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    </Flex>
  )
}
