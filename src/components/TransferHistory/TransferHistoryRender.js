import React from 'react'
import TransferPagination from 'components/Pagination/TransferPagination'
import TransferBody from './TransferBody'
import MockProposal from 'images/mock-proposal.svg'
import { Flex, Text, Image } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const TransferHistoryHeader = () => (
  <Flex flexDirection="row" py={3} bg="#f5f7ff" alignItems="center">
    <Flex ml="30px" flex={5}>
      <Text fontSize="14px" fontWeight={600}>
        From
      </Text>
    </Flex>
    <Flex ml="15px" flex={5}>
      <Text fontSize="14px" fontWeight={600}>
        To
      </Text>
    </Flex>
    <Flex flex={2} justifyContent="flex-end">
      <Text fontSize="14px" fontWeight={600}>
        Quantity
      </Text>
    </Flex>
    <Flex flex={4} justifyContent="flex-end">
      <Text fontSize="14px" fontWeight={600}>
        Timestamp
      </Text>
    </Flex>
    <Flex flex={2} />
  </Flex>
)

export default ({
  numTransfers,
  fetching,
  tokenAddress,
  currentPage,
  onChangePage,
  pageSize,
}) => (
  <Flex
    style={{ borderRadius: '10px' }}
    width={1}
    bg="white"
    flexDirection="column"
  >
    <TransferHistoryHeader />
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
    ) : numTransfers > 0 ? (
      <React.Fragment>
        <TransferBody
          tokenAddress={tokenAddress}
          currentPage={currentPage}
          pageSize={pageSize}
        />
        <TransferPagination
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
            No Transfer right now!
          </Text>
          <Text fontSize={1} py={1}>
            Transfer token to list the first transaction of this community!
          </Text>
        </Flex>
      </Flex>
    )}
  </Flex>
)
