import React from 'react'
import HistoryBody from './HistoryBody'
import { OrderPagination } from 'components/Pagination'
import { Flex, Text, Image } from 'ui/common'
import MockProposal from 'images/mock-proposal.svg'

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
            currentPage={currentPage}
            pageSize={pageSize}
          />
          <OrderPagination
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
}
