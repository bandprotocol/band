import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import { Flex, Box, Text, Card, Image } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import DataSetPriceGraph from 'components/DataSetPriceGraph'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import { getAsset } from 'utils/assetData'

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
import { getPriceKeys } from 'data/detail/price'

const pairToHeader = pair => {
  const [left, right] = pair.split('/')
  const { image: imgl, label: labell } = getAsset(left)
  const { image: imgr, label: labelr } = getAsset(right)
  return labell + '/' + labelr
}

const renderDataPoints = (pairs, tcdAddress, tcdPrefix) => (
  <React.Fragment>
    <Box mt={3}>
      <FlipMove>
        {pairs.map(({ pair, value, lastUpdate }) => {
          let numDigits = 2
          if (tcdPrefix.includes('erc')) {
            numDigits = 6
          } else if (tcdPrefix.includes('fx')) {
            numDigits = 4
          }
          return (
            <DataPoint
              key={pair}
              keyOnChain={pair}
              label={pairToHeader(pair)}
              k={pair}
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
                pair={pair}
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

class CommunityPricePage extends React.Component {
  state = { query: '' }

  onQuery = val => {
    this.setState({
      query: val,
    })
  }

  render() {
    const { tcdAddress, tcdPrefix } = this.props
    return (
      <PriceCountByTCDFetcher tcdAddress={tcdAddress} query={this.state.query}>
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
                  data={getPriceKeys(tcdPrefix)}
                  onQuery={this.onQuery}
                />
              </Flex>
            )}
            {...this.props}
          >
            <CurrentPriceFetcher
              tcdAddress={tcdAddress}
              query={this.state.query}
            >
              {({ fetching, data }) =>
                fetching ? (
                  <Loading
                    height={281}
                    width={924}
                    rects={[
                      [0, 0, 120, 32],
                      [880, 0, 32, 32],
                      [0, 52, 924, 61],
                      [0, 135, 924, 61],
                      [0, 218, 924, 61],
                    ]}
                  />
                ) : (
                  renderDataPoints(data, tcdAddress, tcdPrefix)
                )
              }
            </CurrentPriceFetcher>
          </PageStructure>
        )}
      </PriceCountByTCDFetcher>
    )
  }
}

const mapStateToProps = (state, { communityAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  if (!community) return {}

  let tcdPrefix = null
  try {
    tcdPrefix = community
      .get('tcds')
      .get(tcdAddress)
      .get('prefix')
      .slice(0, -1)
  } catch (e) {}

  return {
    name: community.get('name'),
    address: community.get('address'),
    tcdPrefix: tcdPrefix,
  }
}

export default connect(mapStateToProps)(CommunityPricePage)
