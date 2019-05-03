import React from 'react'
import DataProviderPagination from 'components/Pagination/DataProviderPagination'
import { Flex, Text, Image } from 'ui/common'
import ProviderListBody from './ProviderListBody'
import MockProposal from 'images/mock-proposal.svg'

const ProviderListHeader = ({ symbol }) => (
  <Flex
    flexDirection="row"
    py={3}
    bg="#dee2f0"
    style={{ minHeight: '50px' }}
    alignItems="center"
  >
    <Flex width="60px" px="10px" />
    <Flex flex={19} px="10px">
      <Text
        color="#4a4a4a"
        fontSize="12px"
        fontWeight={500}
        fontFamily="Avenir-Heavy"
      >
        Source
      </Text>
    </Flex>
    <Flex flex={19} px="10px">
      <Text
        color="#4a4a4a"
        fontSize="12px"
        fontWeight={500}
        fontFamily="Avenir-Heavy"
      >
        Contract address
      </Text>
    </Flex>
    <Flex flex={16} justifyContent="center" px="10px">
      <Text
        color="#4a4a4a"
        fontSize="12px"
        fontWeight={500}
        fontFamily="Avenir-Heavy"
      >
        {`Provider stake ${symbol && `(${symbol})`}`}
      </Text>
    </Flex>
    <Flex flex={16} justifyContent="center" px="10px">
      <Text
        color="#4a4a4a"
        fontSize="12px"
        fontWeight={500}
        fontFamily="Avenir-Heavy"
      >
        {`Total stake ${symbol && `(${symbol})`}`}
      </Text>
    </Flex>
    <Flex flex={16} justifyContent="center" px="10px">
      <Text
        color="#4a4a4a"
        fontSize="12px"
        fontWeight={500}
        fontFamily="Avenir-Heavy"
      >
        {`Your stake ${symbol && `(${symbol})`}`}
      </Text>
    </Flex>
    <Flex flex={25} justifyContent="flex-end" px="10px" />
  </Flex>
)

export default props => {
  const {
    user,
    symbol,
    numDataProviders,
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
      <ProviderListHeader symbol={symbol} />
      {numDataProviders > 0 ? (
        <React.Fragment>
          <ProviderListBody
            user={user}
            communityAddress={communityAddress}
            currentPage={currentPage}
            pageSize={pageSize}
          />
          <DataProviderPagination
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
}
