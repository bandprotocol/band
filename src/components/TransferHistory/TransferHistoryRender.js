import React from 'react'
import TransferPagination from 'components/Pagination/TransferPagination'
import TransferBody from './TransferBody'
import MockProposal from 'images/mock-proposal.svg'
import { Flex, Text, Image } from 'ui/common'

const TransferHistoryHeader = () => (
  <Flex
    flexDirection="row"
    py={3}
    bg="#f5f7ff"
    style={{ minHeight: '60px' }}
    alignItems="center"
  >
    <Flex ml="30px" flex={5}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        From
      </Text>
    </Flex>
    <Flex ml="15px" flex={5}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        To
      </Text>
    </Flex>
    <Flex flex={2} justifyContent="flex-end">
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Quantity
      </Text>
    </Flex>
    <Flex flex={4} justifyContent="flex-end">
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Timestamp
      </Text>
    </Flex>
    <Flex flex={2} />
  </Flex>
)

export default ({
  numTransfers,
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
      <TransferHistoryHeader />
      {numTransfers > 0 ? (
        <React.Fragment>
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
}
