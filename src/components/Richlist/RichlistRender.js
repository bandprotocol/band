import React from 'react'

import RichListPagination from 'components/Pagination/RichListPagination'

import { Flex, Text } from 'ui/common'
import RichlistBody from './RichlistBody'

const RichlistHeader = () => (
  <Flex
    flexDirection="row"
    py={3}
    bg="#f5f7ff"
    style={{ minHeight: '60px' }}
    alignItems="center"
  >
    <Flex pl="30px" flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Rank
      </Text>
    </Flex>
    <Flex flex={2}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Balance
      </Text>
    </Flex>
    <Flex flex={4}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Address
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({ communityAddress, currentPage, onChangePage, pageSize }) => (
  <Flex
    style={{ borderRadius: '10px' }}
    width={1}
    bg="white"
    flexDirection="column"
    pb={3}
  >
    <RichlistHeader />
    <RichlistBody
      communityAddress={communityAddress}
      currentPage={currentPage}
      pageSize={pageSize}
    />
    <RichListPagination
      communityAddress={communityAddress}
      pageSize={pageSize}
      currentPage={currentPage}
      onChangePage={onChangePage}
    />
  </Flex>
)
