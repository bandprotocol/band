import React from 'react'

import { OrderPagination } from 'components/Pagination'
import TransferBody from './TransferBody'

import { Flex, Text, Box } from 'ui/common'
import { Utils } from 'band.js'
import { colors } from 'ui'

const TransferHistoryHeader = () => (
  <Flex
    flexDirection="row"
    py={3}
    bg="#f5f7ff"
    style={{ minHeight: '60px' }}
    alignItems="center"
  >
    <Flex pl="30px" flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        TxHash
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        From
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        To
      </Text>
    </Flex>
    <Flex flex={1}>
      <Text color="#4a4a4a" fontSize="16px" fontWeight={500}>
        Quantity
      </Text>
    </Flex>
  </Flex>
)

export default ({
  options,
  selectedOption,
  onChange,
  communityAddress,
  currentPage,
  onChangePage,
  pageSize,
}) => {
  ;(async () => {
    const test = await Utils.graphqlRequest(
      `
        {
          community(address:"0xd788b98722581456f051783c47D90aAD04AD6770") {
            token {
              transferHistory {
                tx {
                  txHash
                }
                sender {
                  address
                }
                receiver {
                  address
                }
                value
              }
            }
          }
        }
        `,
    )
    console.log(test)
  })()
  return (
    <Flex
      style={{ borderRadius: '10px' }}
      width={1}
      bg="white"
      flexDirection="column"
      pb={3}
    >
      <TransferHistoryHeader />
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
