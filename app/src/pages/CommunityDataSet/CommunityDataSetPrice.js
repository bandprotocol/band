import React from 'react'
import moment from 'moment'
import { Flex, Box, Text, Card } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import DataSetPriceGraph from 'components/DataSetPriceGraph'
import DatasetTab from 'components/DatasetTab'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import {
  CRYPTO_TYPE,
  FX_TYPE,
  USEQUITY_TYPE,
  ERC20_TYPE,
} from 'data/detail/price'

import {
  CurrentPriceFetcher,
  PriceCountByTCDFetcher,
  PricePairFetcher,
  formatPricePairsForGraph,
} from 'data/fetcher/PriceFetcher'
import PriceTable from 'components/table/PriceTable'
import Loading from 'components/Loading'
import DataHeader from 'components/DataHeader'
import AutocompletedSearch from 'components/AutocompletedSearch'
import { getAllPriceLabelFromType } from 'data/detail/price'

// Image
import FxSrc from 'images/dataset-fiat.png'
import ErcSrc from 'images/dataset-erc20.png'
import UseqSrc from 'images/dataset-stock.png'
import CryptoSrc from 'images/dataset-crypto.png'

const renderDataPoints = (pairs, tcdAddress, tcdPrefix) => (
  <React.Fragment>
    <Box mt={3}>
      <FlipMove>
        {pairs.map(({ pair, key, value, lastUpdate }) => {
          let numDigits = 2
          if (value > 1) numDigits = 2
          else if (value > 0.001) numDigits = 4
          else numDigits = 6
          return (
            <DataPoint
              key={key}
              keyOnChain={key}
              label={pair}
              k={key}
              v={() => (
                <Card
                  flex="0 0 auto"
                  bg="white"
                  py={2}
                  px={3}
                  borderRadius="4px"
                >
                  <Text
                    ml="auto"
                    fontFamily="code"
                    fontSize={14}
                    fontWeight="bold"
                    color="#4a4a4a"
                  >
                    {value.toLocaleString('en-US', {
                      currency: 'USD',
                      minimumFractionDigits: numDigits,
                      maximumFractionDigits: numDigits,
                    })}
                  </Text>
                </Card>
              )}
              updatedAt={lastUpdate}
            >
              <PricePairFetcher
                keyOnChain={key}
                tcdAddress={tcdAddress}
                from={moment(1556150400000)}
              >
                {({ fetching, data }) =>
                  fetching ? (
                    <Loading
                      height={514}
                      width={922}
                      rects={[
                        [24, 24, 922 - 48, 300 - 48],
                        [24, 300, 922 - 48, 36, 8],
                        [24, 300 + 36 + 8 + 4, 922 - 48, 32 - 8, 8],
                        [24, 300 + 36 + 8 + 4 + 32, 922 - 48, 32 - 8, 8],
                        [24, 300 + 36 + 8 + 4 + 32 * 2, 922 - 48, 32 - 8, 8],
                        [24, 300 + 36 + 8 + 4 + 32 * 3, 922 - 48, 32 - 8, 8],
                        [24, 300 + 36 + 8 + 4 + 32 * 4, 922 - 48, 32 - 8, 8],
                      ]}
                    />
                  ) : (
                    <React.Fragment>
                      <Box px={4} pb={4}>
                        <DataSetPriceGraph
                          data={formatPricePairsForGraph(data)}
                          numberOfProvider={data.length}
                        />
                      </Box>
                      <PriceTable mb={2} data={data} numDigits={numDigits} />
                    </React.Fragment>
                  )
                }
              </PricePairFetcher>
            </DataPoint>
          )
        })}
      </FlipMove>
    </Box>
  </React.Fragment>
)

export default class CommunityPricePage extends React.Component {
  state = { query: '', type: CRYPTO_TYPE }

  onQuery = val => {
    this.setState({
      query: val,
    })
  }

  render() {
    const { tcdAddress, tcdPrefix } = this.props
    return (
      <PriceCountByTCDFetcher
        tcdAddress={tcdAddress}
        type={this.state.type}
        query={this.state.query}
      >
        {({ fetching: countFetching, data: totalCount }) => (
          <PageStructure
            renderHeader={() => (
              <DataHeader
                lines={[
                  'On-chain Data You Can Trust',
                  'Readily Available for Ethereum Smart Contract',
                  'Token holders collectively curate trustworthy data providers.',
                  'By staking their tokens, they earn a portion of fee from the providers.',
                ]}
              />
            )}
            renderSubheader={() => (
              <Flex
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                color="#4a4a4a"
                pl="52px"
                pr="20px"
              >
                <Text fontSize="15px" fontFamily="head" fontWeight="600">
                  {countFetching ? '' : `${totalCount} Pairs Available`}
                </Text>
                <AutocompletedSearch
                  data={getAllPriceLabelFromType(this.state.type)}
                  onQuery={this.onQuery}
                />
              </Flex>
            )}
            {...this.props}
          >
            <Flex justifyContent="center">
              <DatasetTab
                mx="8px"
                title="Cryptocurrency"
                src={CryptoSrc}
                active={this.state.type === CRYPTO_TYPE}
                onClick={() => this.setState({ type: CRYPTO_TYPE })}
              />
              <DatasetTab
                mx="8px"
                title="ERC-20 Pairs"
                src={ErcSrc}
                active={this.state.type === ERC20_TYPE}
                onClick={() => this.setState({ type: ERC20_TYPE })}
              />
              <DatasetTab
                mx="8px"
                title="Foreign Exchange"
                src={FxSrc}
                active={this.state.type === FX_TYPE}
                onClick={() => this.setState({ type: FX_TYPE })}
              />
              <DatasetTab
                mx="8px"
                title="US Equities"
                src={UseqSrc}
                active={this.state.type === USEQUITY_TYPE}
                onClick={() => this.setState({ type: USEQUITY_TYPE })}
              />
            </Flex>
            <CurrentPriceFetcher
              tcdAddress={tcdAddress}
              query={this.state.query}
              type={this.state.type}
            >
              {({ fetching, data }) =>
                fetching ? (
                  <Box mt={3}>
                    <Loading
                      height={361}
                      width={924}
                      rects={[
                        [0, 0, 924, 60],
                        [0, 72, 924, 60],
                        [0, 144, 924, 60],
                        [0, 72 * 3, 924, 60],
                        [0, 72 * 4, 924, 60],
                      ]}
                    />
                  </Box>
                ) : totalCount !== 0 ? (
                  renderDataPoints(data, tcdAddress, tcdPrefix)
                ) : (
                  <Flex mt="100px" justifyContent="center" alignItems="center">
                    <Text fontSize="28px" fontFamily="head" fontWeight="600">
                      There is no data avaliable.
                    </Text>
                  </Flex>
                )
              }
            </CurrentPriceFetcher>
          </PageStructure>
        )}
      </PriceCountByTCDFetcher>
    )
  }
}
