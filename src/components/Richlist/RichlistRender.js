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
    <Flex ml="30px" flex={2}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Rank
      </Text>
    </Flex>
    <Flex flex={5}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Address
      </Text>
    </Flex>
    <Flex flex={3} justifyContent="flex-end">
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Quantity
      </Text>
    </Flex>
    <Flex flex={2} justifyContent="flex-end" mr="30px">
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Percentage
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default props => {
  const {
    numberOfHolders,
    communityAddress,
    currentPage,
    onChangePage,
    pageSize,
  } = props
  return (
    <Flex
      style={{ borderRadius: '10px' }}
      width={1}
      bg="white"
      flexDirection="column"
    >
      <RichlistHeader />
      {numberOfHolders > 0 ? (
        <React.Fragment>
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
