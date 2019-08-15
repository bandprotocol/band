import React from 'react'
import DataProviderPagination from 'components/Pagination/DataProviderPagination'
import { Flex, Text, Image } from 'ui/common'
import ProviderListBody from './ProviderListBody'
import MockProposal from 'images/mock-proposal.svg'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const ProviderListHeader = ({ symbol }) => (
  <Flex
    flexDirection="row"
    py={2}
    bg="#eff2ff"
    style={{ minHeight: '50px' }}
    alignItems="center"
  >
    <Flex ml="17px" width="60px" />
    <Flex flex={20} px="10px">
      <Text
        color="#6878e2"
        fontSize="14px"
        lineHeight="1.4em"
        fontWeight="bold"
      >
        Source
      </Text>
    </Flex>
    <Flex flex={20} px="10px">
      <Text
        color="#6878e2"
        fontSize="14px"
        lineHeight="1.4em"
        fontWeight="bold"
      >
        Contract Address
      </Text>
    </Flex>
    <Flex flex={12} justifyContent="center" px="10px">
      <Text
        color="#6878e2"
        fontSize="14px"
        lineHeight="1.4em"
        fontWeight="bold"
        textAlign="center"
      >
        {`Provider Stake`}
        {symbol && (
          <Text color="#4a4a4a" fontSize="12px" fontWeight="bold">
            ({symbol})
          </Text>
        )}
      </Text>
    </Flex>
    <Flex flex={12} justifyContent="center" px="10px">
      <Text
        color="#6878e2"
        fontSize="14px"
        lineHeight="1.4em"
        fontWeight="bold"
        textAlign="center"
      >
        {`Total Stake`}
        {symbol && (
          <Text color="#4a4a4a" fontSize="12px" fontWeight="bold">
            ({symbol})
          </Text>
        )}
      </Text>
    </Flex>
    <Flex flex={12} justifyContent="center" px="10px">
      <Text
        color="#6878e2"
        fontSize="14px"
        lineHeight="1.4em"
        fontWeight="bold"
        textAlign="center"
      >
        {`Your Stake`}
        {symbol && (
          <Text color="#4a4a4a" fontSize="12px" fontWeight="bold">
            ({symbol})
          </Text>
        )}
      </Text>
    </Flex>
    <Flex flex={12} justifyContent="center" px="10px">
      <Text
        color="#6878e2"
        fontSize="14px"
        lineHeight="1.4em"
        fontWeight="bold"
        textAlign="center"
      >
        {`Your Revenue`}
        {symbol && (
          <Text color="#4a4a4a" fontSize="12px" fontWeight="bold">
            ({symbol})
          </Text>
        )}
      </Text>
    </Flex>
    <Flex flex="0 0 265px" justifyContent="flex-end" px="10px" />
  </Flex>
)

export default ({
  user,
  symbol,
  numDataProviders,
  tokenAddress,
  tcdAddress,
  currentPage,
  onChangePage,
  pageSize,
  fetching,
}) => (
  <Flex
    style={{ borderRadius: '10px' }}
    width={1}
    bg="white"
    flexDirection="column"
  >
    <ProviderListHeader symbol={symbol} />
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
    ) : numDataProviders > 0 ? (
      <React.Fragment>
        <ProviderListBody
          user={user}
          tokenAddress={tokenAddress}
          tcdAddress={tcdAddress}
          currentPage={currentPage}
          pageSize={pageSize}
        />
        <DataProviderPagination
          tokenAddress={tokenAddress}
          tcdAddress={tcdAddress}
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
            No data provider list right now!
          </Text>
          <Text fontSize={1} py={1}>
            Click "Become a provider" to become the first provider.
          </Text>
        </Flex>
      </Flex>
    )}
  </Flex>
)
