import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'

const ALLTYPE = {
  FX: ['CNY/USD', 'EUR/USD', 'THB/USD', 'JPY/USD', 'GBP/USD'],
  COMMODITY: ['XAU/USD', 'XAG/USD'],
  STOCK: [
    'AAPL/USD',
    'AMZN/USD',
    'FB/USD',
    'GOOG/USD',
    'INTC/USD',
    'MSFT/USD',
    'NFLX/USD',
    'NVDA/USD',
    'ORCL/USD',
    'SBUX/USD',
  ],
  CRYPTO: ['BTC/USD', 'ETH/USD', 'LTC/USD'],
}

const allPriceFeedQL = () => `
{
  allDataPriceFeeds(orderBy: PAIR_ASC) {
    nodes {
      value
      pair
      lastUpdate
    }
  }
}
`

const allProvidersByPairQL = (pair, from) => `
{
  allDataProviders {
    nodes {
      detail
      status
      dataSourceAddress
      dataPriceFeedRawsByDataSourceAddressAndTcdAddress(
        filter: { timestamp: { greaterThan: ${from} } }
        condition: { pair: "${pair}" }
        orderBy: TIMESTAMP_ASC
      ) {
        nodes {
          timestamp
          value
        }
      }
    }
  }
}
`

export const PriceCountByTypeFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const { type } = this.props
      return ALLTYPE[type].length
    }
  },
)

export const CurrentPriceFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const {
        allDataPriceFeeds: { nodes },
      } = await Utils.graphqlRequest(allPriceFeedQL())

      const { type } = this.props
      return nodes
        .filter(({ pair }) => {
          if (type && type === 'ALL') {
            return true
          }
          return pair.match(/USD/g) && type && ALLTYPE[type].includes(pair)
        })
        .map(({ lastUpdate, pair, value }) => ({
          pair,
          value: value ? Utils.fromBlockchainUnit(value) : 0,
          lastUpdate: moment(lastUpdate * 1000),
        }))
    }
  },
)

export const PricePairFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.pair !== this.props.pair
    }

    async fetch() {
      const { pair, from } = this.props
      const {
        allDataProviders: { nodes },
      } = await Utils.graphqlRequest(
        allProvidersByPairQL(pair, moment(from).unix()),
      )

      return nodes
        .filter(
          n => n.dataPriceFeedRawsByDataSourceAddressAndTcdAddress.nodes.length,
        )
        .map(
          ({
            detail,
            status,
            dataSourceAddress,
            dataPriceFeedRawsByDataSourceAddressAndTcdAddress,
          }) => {
            const feed = dataPriceFeedRawsByDataSourceAddressAndTcdAddress.nodes.map(
              ({ timestamp, value }) => ({
                value: Utils.fromBlockchainUnit(value),
                time: moment(timestamp * 1000),
              }),
            )

            return {
              name: detail,
              status,
              address: dataSourceAddress,
              feed,
              lastUpdate: feed.length && feed.slice(-1)[0].time,
              lastValue: feed.length && feed.slice(-1)[0].value,
            }
          },
        )
    }
  },
)

export const formatPricePairsForGraph = pairs => {
  const timeset = new Set()

  // Get all the time
  pairs.forEach(p => p.feed.forEach(({ time }) => timeset.add(time.valueOf())))
  const timeline = [...timeset].sort()
  const takeEvery = Math.ceil(timeline.length / 100) // At most 100 data points
  const filteredTimeline = timeline.filter(
    (e, idx) => idx % takeEvery == 0 || idx === timeline.length - 1,
  )
  const timetable = [['Time', ...pairs.map(p => p.name)]]

  // Iterate through the filtered timeline and build a square matrix
  const currentIndex = {}
  pairs.map(({ address }) => {
    currentIndex[address] = 0
  })
  filteredTimeline.map(t => {
    const row = [new Date(t)]
    pairs.map(({ address, feed }) => {
      while (
        currentIndex[address] < feed.length &&
        t >= feed[currentIndex[address]].time.valueOf()
      )
        currentIndex[address]++

      row.push(
        currentIndex[address]
          ? feed[currentIndex[address] - 1].value
          : undefined,
      )
      timetable.push(row)
    })
  })

  return timetable
}
