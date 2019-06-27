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
      const prices = await Utils.getDataRequest(
        '/prices/0x0233b33A43081cfeb7B49caf623b2b5841dB7596',
        { key: 'TC' },
      )

      return prices.map(({ key, value }) => ({
        pair: key,
        value: parseInt(value) / 1e18,
        lastUpdate: moment(Date.now()),
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

      const reports = await Utils.getDataRequest(
        '/0x0233b33A43081cfeb7B49caf623b2b5841dB7596/data-points',
        { key: pair },
      )

      const providers = {}
      for (const report of reports) {
        const { reportedData, timestamp } = report
        const kvs = Object.entries(reportedData)
        for (const kv of kvs) {
          if (!providers[kv[0]]) {
            providers[kv[0]] = []
          }
          providers[kv[0]] = providers[kv[0]].concat([
            {
              time: timestamp,
              value: parseInt(kv[1]) / 1e18,
            },
          ])
        }
      }

      for (const key of Object.keys(providers)) {
        providers[key] = providers[key].sort((a, b) => {
          if (a.time > b.time) {
            return 1
          } else {
            return -1
          }
        })
      }

      return Object.keys(providers).map((k, i) => {
        return {
          name: 'detail_',
          status: 'status',
          address: k,
          feed: providers[k],
          lastUpdate: moment(providers[k].slice(-1)[0].time * 1000),
          lastValue: providers[k].slice(-1)[0].value,
        }
      })
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
