import React from 'react'
import colors from 'ui/colors'
import moment from 'moment'
import { Flex, Box, Text, Card, Image, Heading } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import DataSetPriceGraph from 'components/DataSetPriceGraph'
import DataPoint from 'components/DataPoint'
import DataCard from 'components/DataCard'
import FlipMove from 'react-flip-move'
import {
  CurrentPriceFetcher,
  PricePairFetcher,
  formatPricePairsForGraph,
} from 'data/fetcher/PriceFetcher'
import PriceTable from 'components/table/PriceTable'
import Loading from 'components/Loading'

const renderDataPoints = (pairs, type) => (
  <React.Fragment>
    <Box mt={3}>
      <FlipMove>
        {pairs.map(({ pair, value, lastUpdate }) => (
          <DataPoint
            key={pair}
            keyOnChain={pair}
            label={pair}
            k={pair}
            v={() => (
              <Card flex="0 0 auto" bg="white" py={2} px={3} borderRadius="4px">
                <Text
                  ml="auto"
                  fontFamily="code"
                  fontSize={14}
                  fontWeight="bold"
                  color="#4a4a4a"
                >
                  {value.toLocaleString('en-US', {
                    currency: 'USD',
                    minimumFractionDigits: type === 'FX' ? 4 : 2,
                    maximumFractionDigits: type === 'FX' ? 4 : 2,
                  })}
                </Text>
              </Card>
            )}
            updatedAt={lastUpdate}
          >
            <PricePairFetcher pair={pair} from={moment(1556150400000)}>
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
                    <DataSetPriceGraph data={formatPricePairsForGraph(data)} />
                    <PriceTable mb={2} data={data} type={type} />
                  </React.Fragment>
                )
              }
            </PricePairFetcher>
          </DataPoint>
        ))}
      </FlipMove>
    </Box>
  </React.Fragment>
)

export default class CommunityPricePage extends React.Component {
  state = { type: 'CRYPTO' }

  render() {
    const { tcdAddress } = this.props
    return (
      <PageStructure
        renderHeader={() => (
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Text fontSize="36px" fontWeight="900">
              Price Feed
            </Text>
            <Text fontSize="20px" mt={3}>
              Get current prices of any trading currency pairs
            </Text>
          </Flex>
        )}
        {...this.props}
      >
        <DataCard
          headerText={`${this.currentSportLength || 0} Data Prices `}
          withSearch={false}
        >
          <CurrentPriceFetcher type={this.state.type}>
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
                renderDataPoints(data, this.state.type)
              )
            }
          </CurrentPriceFetcher>
        </DataCard>
      </PageStructure>
    )
  }
}
