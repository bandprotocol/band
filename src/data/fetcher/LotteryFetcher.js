import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'

const compareBalls = (a, b) =>
  a.whiteBall1 === b.whiteBall1 &&
  a.whiteBall2 === b.whiteBall2 &&
  a.whiteBall3 === b.whiteBall3 &&
  a.whiteBall4 === b.whiteBall4 &&
  a.whiteBall5 === b.whiteBall5 &&
  a.redBall === b.redBall &&
  a.mul === b.mul

const countAllLotteryQL = type => `
{
  allDataLotteryFeeds(
    filter: { redBall: { isNull: false } }
  ) {
    totalCount
  }
}
`

const countLotteryQL = type => `
{
  allDataLotteryFeeds(
    condition: {lotteryType: "${type}"}
    filter: { redBall: { isNull: false } }
  ) {
    totalCount
  }
}
`

const allLotteryByTypeQL = (type, nList) => `
{
  allDataLotteryFeeds(orderBy: LOTTERY_TIME_DESC, condition: {lotteryType: "${type}"}, filter: {redBall: {isNull: false}}, first: ${nList}) {
    nodes {
      lastUpdate
      lotteryTime
      redBall
      whiteBall1
      whiteBall2
      whiteBall4
      whiteBall3
      whiteBall5
      mul
    }
  }
}

`

const allProvidersByTypeTimeQL = (type, time) => `
{
  allDataLotteryFeedRaws(
    condition: { lotteryType: "${type}", lotteryTime: "${time}" }
    orderBy: TIMESTAMP_DESC
  ) {
    nodes {
      timestamp
      redBall
      whiteBall1
      whiteBall2
      whiteBall3
      whiteBall4
      whiteBall5
      mul
      dataProviderByDataSourceAddressAndAggregateContract {
        dataSourceAddress
        detail
        status
      }
    }
  }
}
`

export const LotteryCountAllFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return false
    }

    async fetch() {
      const {
        allDataLotteryFeeds: { totalCount },
      } = await Utils.graphqlRequest(countAllLotteryQL())

      return totalCount
    }
  },
)

export const LotteryCountByTypeFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const { type } = this.props

      const {
        allDataLotteryFeeds: { totalCount },
      } = await Utils.graphqlRequest(countLotteryQL(type))

      return totalCount
    }
  },
)

export const LotteryByTypeFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const { type, nList } = this.props
      const {
        allDataLotteryFeeds: { nodes },
      } = await Utils.graphqlRequest(allLotteryByTypeQL(type, nList))

      return nodes.map(({ lotteryTime, lastUpdate, ...ballResult }) => ({
        time: moment(lotteryTime, 'YYYYMMDD'),
        lastUpdate: moment(lastUpdate * 1000),
        keyOnChain: `${type}/${lotteryTime}`,
        ...ballResult,
      }))
    }
  },
)

export const LotteryProvidersByTypeTimeFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.type !== this.props.type || prevProps.time !== this.props.time
      )
    }

    async fetch() {
      const { type, time } = this.props
      const {
        allDataLotteryFeedRaws: { nodes },
      } = await Utils.graphqlRequest(allProvidersByTypeTimeQL(type, time))

      // Aggregate results and see if the provider has reported maliciously
      const providers = {}

      nodes.forEach(
        ({
          timestamp,
          dataProviderByDataSourceAddressAndAggregateContract: {
            dataSourceAddress,
            detail,
            status,
          },
          ...balls
        }) => {
          if (!providers[dataSourceAddress]) {
            providers[dataSourceAddress] = {
              name: detail,
              address: dataSourceAddress,
              lastUpdate: moment(timestamp * 1000),
              status,
              balls,
            }
          } else {
            if (!compareBalls(balls, providers[dataSourceAddress].balls)) {
              providers[dataSourceAddress].warning =
                'The provider has previously reported different result for this lottery'
            }
          }
        },
      )

      const allProviders = Object.values(providers).map(
        ({ balls, ...rest }) => ({ ...balls, ...rest }),
      )
      allProviders.sort((a, b) =>
        a.lastUpdate.isBefore(b.lastUpdate) ? 1 : -1,
      )

      return allProviders
    }
  },
)
