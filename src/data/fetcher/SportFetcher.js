import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'

const countSportAllQL = type => `
{
  allDataSportFeeds(
    orderBy: LAST_UPDATE_DESC
    filter: { scoreAway: { isNull: false } }
  ) {
    totalCount
  }
}
`
const countSportQL = type => `
{
  allDataSportFeeds(
    orderBy: LAST_UPDATE_DESC
    condition: { sportType: "${type}" }
    filter: { scoreAway: { isNull: false } }
  ) {
    totalCount
  }
}
`

const allSportByTypeQL = (type, nList) => `
{
    allDataSportFeeds(orderBy: SPORT_TIME_DESC, condition: {sportType: "${type}"}, filter: {scoreAway: {isNull: false}}, first: ${nList}) {
      nodes {
        away
        scoreAway
        scoreHome
        sportTime
        sportType
        sportStartTime
        home
        year
        lastUpdate
      }
    }
  }
  
`

const allProvidersByTypeTimeTeamQL = (type, time, startTime, home, away) => `
{
  allDataSportFeedRaws(
    condition: { 
      sportType: "${type}"
      sportTime: "${time}"
      sportStartTime: "${startTime}"
      away: "${away}"
      home: "${home}"
    }
    orderBy: TIMESTAMP_DESC
  ) {
    nodes {
      timestamp
      scoreAway
      scoreHome
      dataProviderByDataSourceAddressAndAggregateContract {
        dataSourceAddress
        detail
        status
      }
    }
  }
}

`

export const SportCountAllFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return false
    }

    async fetch() {
      const {
        allDataSportFeeds: { totalCount },
      } = await Utils.graphqlRequest(countSportAllQL())

      return totalCount
    }
  },
)

export const SportCountByTypeFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const { type } = this.props

      const {
        allDataSportFeeds: { totalCount },
      } = await Utils.graphqlRequest(countSportQL(type))

      return totalCount
    }
  },
)

export const SportByTypeFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const { type, nList } = this.props
      const {
        allDataSportFeeds: { nodes },
      } = await Utils.graphqlRequest(allSportByTypeQL(type, nList))

      return nodes.map(
        ({
          sportTime,
          sportStartTime,
          lastUpdate,
          sportType,
          year,
          ...result
        }) => ({
          time: moment(
            sportTime + (sportStartTime === '9999' ? '0000' : sportStartTime),
            'YYYYMMDDHHm',
          ),
          hasStartTime: sportStartTime !== '9999',
          lastUpdate: moment(lastUpdate * 1000),
          keyOnChain: `${sportType}${year}/${sportTime}/${result.home}-${
            result.away
          }${sportStartTime === '9999' ? '' : '/' + sportStartTime}`,
          ...result,
        }),
      )
    }
  },
)

export const SportProvidersByTypeTimeTeamFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.type !== this.props.type ||
        prevProps.time !== this.props.time ||
        prevProps.startTime !== this.props.startTime ||
        prevProps.away !== this.props.away ||
        prevProps.home !== this.props.home
      )
    }

    async fetch() {
      const { type, time, startTime, home, away } = this.props
      const {
        allDataSportFeedRaws: { nodes },
      } = await Utils.graphqlRequest(
        allProvidersByTypeTimeTeamQL(type, time, startTime, home, away),
      )

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
          scoreAway,
          scoreHome,
        }) => {
          if (!providers[dataSourceAddress]) {
            providers[dataSourceAddress] = {
              name: detail,
              address: dataSourceAddress,
              lastUpdate: moment(timestamp * 1000),
              status,
              scoreAway,
              scoreHome,
              home,
              away,
            }
          } else {
            if (
              providers[dataSourceAddress].scoreAway !== scoreAway ||
              providers[dataSourceAddress].scoreAway !== scoreHome
            ) {
              providers[dataSourceAddress].warning =
                'The provider has previously reported different result for this match'
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
