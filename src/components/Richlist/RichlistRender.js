import React from 'react'
import RichListPagination from 'components/Pagination/RichListPagination'
import { Flex, Text, Image } from 'ui/common'
import RichlistBody from './RichlistBody'
import MockProposal from 'images/mock-proposal.svg'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

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
    <Flex flex={5} ml="10px">
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

export default ({
  numberOfHolders,
  communityAddress,
  currentPage,
  fetching,
  onChangePage,
  pageSize,
}) => (
  <Flex
    style={{ borderRadius: '10px' }}
    width={1}
    bg="white"
    flexDirection="column"
  >
    <RichlistHeader />
    {fetching ? (
      <Flex
        width={1}
        justifyContent="center"
        alignItems="center"
        fontWeight={500}
        style={{ height: '600px' }}
      >
        <CircleLoadingSpinner radius="80px" />
      </Flex>
    ) : numberOfHolders > 0 ? (
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
        <Flex flexDirection="column" alignItems="center">
          <Image src={MockProposal} />
          <Text fontSize={3} fontWeight="600" pt={3} pb={2}>
            No rich list right now!
          </Text>
          <Text fontSize={1} py={1}>
            Buy token to become the first holder.
          </Text>
        </Flex>
      </Flex>
    )}
  </Flex>
)
