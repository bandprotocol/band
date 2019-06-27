import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { getProvider } from 'data/Providers'
import { Utils } from 'band.js'

export const CurrentPriceFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.tcdAddress !== this.props.tcdAddress
    }

    async fetch() {
      const { tcdAddress, setNumDataPoints } = this.props
      const prices = await Utils.getDataRequest(`/prices/${tcdAddress}`)

      setNumDataPoints(prices.length)

      return prices
        .map(({ key, value, timestamp }) => ({
          pair: key,
          value: parseInt(value) / 1e18,
          lastUpdate: moment(timestamp * 1000),
        }))
        .sort((a, b) => {
          if (a.pair > b.pair) return 1
          return -1
        })
    }
  },
)

export const PricePairFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.pair !== this.props.pair
    }

    async fetch() {
      const { pair, tcdAddress } = this.props

      const reports = await Utils.getDataRequest(`/${tcdAddress}/data-points`, {
        key: pair,
      })

      if (reports.length < 2) {
        reports.push(reports[0])
      }

      const providers = {}
      const providerLastUpdate = {}
      for (const report of reports) {
        const { reportedData, timestamp } = report
        const kvs = Object.entries(reportedData)
        for (const [address, vt] of kvs) {
          if (!providers[address]) {
            providers[address] = []
          }
          if (!providerLastUpdate[address]) {
            providerLastUpdate[address] = { ...vt }
          } else if (vt.timestamp > providerLastUpdate[address].timestamp) {
            providerLastUpdate[address] = { ...vt }
          }

          providers[address] = providers[address].concat([
            {
              time: timestamp,
              value: parseInt(vt.value) / 1e18,
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
          name: getProvider(k).name,
          status: 'status',
          address: k,
          feed: providers[k].map(({ time, value }) => ({
            time: moment(time * 1000),
            value: value,
          })),
          lastUpdate: moment(providerLastUpdate[k].timestamp * 1000),
          lastValue: providerLastUpdate[k].value / 1e18,
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
    (e, idx) => idx % takeEvery === 0 || idx === timeline.length - 1,
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
