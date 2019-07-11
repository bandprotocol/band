import React from 'react'
import HistoryBody from './HistoryBody'
import { OrderPagination } from 'components/Pagination'
import { Flex, Text, Image } from 'ui/common'
import MockProposal from 'images/mock-proposal.svg'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const HistoryHeader = () => (
  <Flex
    flexDirection="row"
    py={3}
    bg="#f5f7ff"
    alignItems="center"
    color="#6878e2"
    style={{ border: 'solid 1px #e7ecff' }}
  >
    <Flex ml="30px" flex={1}>
      <Text fontSize="14px" fontWeight={600}>
        Time
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text fontSize="14px" fontWeight={600}>
        Price (BAND) / Token
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Text fontSize="14px" fontWeight={600}>
        Amount
      </Text>
    </Flex>
    <Flex flex={1} justifyContent="flex-end">
      <Text fontSize="14px" fontWeight={600}>
        Type
      </Text>
    </Flex>
    <Flex flex={1} />
  </Flex>
)

export default ({
  fetching,
  numOrders,
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
    <HistoryHeader />
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
    ) : numOrders > 0 ? (
      <React.Fragment>
        <HistoryBody
          tokenAddress={tokenAddress}
          currentPage={currentPage}
          pageSize={pageSize}
        />
        <OrderPagination
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
            No History right now!
          </Text>
          <Text fontSize={1} py={1}>
            Buy or sell token to list the first transaction of this community!
          </Text>
        </Flex>
      </Flex>
    )}
  </Flex>
)
