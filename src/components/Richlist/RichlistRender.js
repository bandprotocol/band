import React from 'react'
import RichListPagination from 'components/Pagination/RichListPagination'
import { Flex, Text, Image } from 'ui/common'
import RichlistBody from './RichlistBody'
import MockProposal from 'images/mock-proposal.svg'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const RichlistHeader = () => (
  <Flex flexDirection="row" py={3} bg="#f5f7ff" alignItems="center">
    <Flex ml="30px" flex={2}>
      <Text fontSize="14px" fontWeight={600}>
        Rank
      </Text>
    </Flex>
    <Flex flex={5} ml="10px">
      <Text fontSize="14px" fontWeight={600}>
        Address
      </Text>
    </Flex>
    <Flex flex={3} justifyContent="flex-end">
      <Text fontSize="14px" fontWeight={600}>
        Quantity
      </Text>
    </Flex>
    <Flex flex={2} justifyContent="flex-end" mr="30px">
      <Text fontSize="14px" fontWeight={600}>
        Percentage
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({
  numberOfHolders,
  tokenAddress,
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
        style={{ height: '460px' }}
      >
        <CircleLoadingSpinner radius="80px" />
      </Flex>
    ) : numberOfHolders > 0 ? (
      <React.Fragment>
        <RichlistBody
          tokenAddress={tokenAddress}
          currentPage={currentPage}
          pageSize={pageSize}
        />
        <RichListPagination
          tokenAddress={tokenAddress}
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
        style={{ height: '460px' }}
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
