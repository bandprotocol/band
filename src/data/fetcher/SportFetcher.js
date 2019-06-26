import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'
import { getSportTeamByCode } from 'utils/sportTeam'

const randNum = n =>
  n > 0
    ? `${Math.ceil(Math.random() * 9)}${randNum(n - 1)}`
    : Math.ceil(Math.random() * 9)

const randStr = n =>
  n > 0
    ? `${'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]}${randStr(
        n - 1,
      )}`
    : 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]

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
const countSportQL = (type, home, away) => `
{
  allDataSportFeeds(
    orderBy: LAST_UPDATE_DESC
    condition: { sportType: "${type}" }
    filter: {
      scoreAway: { isNull: false }
      ${home ? `home: { equalTo: "${home}" }` : ``}
      ${away ? `away: { equalTo: "${away}" }` : ``}
    }
  ) {
    totalCount
  }
}
`

const allSportByTypeQL = (type, nList, home, away) => `
{
  allDataSportFeeds(
    orderBy: SPORT_TIME_DESC
    condition: { sportType: "${type}" }
    filter: {
      scoreAway: { isNull: false }
      ${home ? `home: { equalTo: "${home}" }` : ``}
      ${away ? `away: { equalTo: "${away}" }` : ``}
    }
    first: ${nList}
  ) {
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
      dataProviderByDataSourceAddressAndTcdAddress {
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
      const { type, home, away } = this.props

      const {
        allDataSportFeeds: { totalCount },
      } = await Utils.graphqlRequest(countSportQL(type, home, away))

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
      const { type, nList, home, away } = this.props
      const {
        allDataSportFeeds: { nodes },
      } = await Utils.graphqlRequest(allSportByTypeQL(type, nList, home, away))

      return [1, 2, 3, 4, 5].map(i => {
        const sportTime = '20190321'
        const sportStartTime = '1815'
        const sportType = 'EPL'
        const year = '2019'
        const home = 'TES' + i
        const away = 'MOC' + i
        const scoreAway = Math.floor(Math.random() * 100)
        const scoreHome = Math.floor(Math.random() * 100)
        return {
          time: moment(
            sportTime + (sportStartTime === '9999' ? '0000' : sportStartTime),
            'YYYYMMDDHHm',
          ),
          hasStartTime: sportStartTime !== '9999',
          lastUpdate: moment(
            Date.now() - 86400000 * Math.ceil(Math.random() * 100),
          ),
          keyOnChain: `${sportType}${year}/${sportTime}/${home}-${away}${
            sportStartTime === '9999' ? '' : '/' + sportStartTime
          }`,
          home,
          away,
          homeFullName: '🍷 Indianapolis Colts',
          awayFullName: '🍹Los Angeles Chargers',
          scoreAway: scoreAway,
          scoreHome: scoreHome,
        }
      })

      return nodes.map(
        ({
          sportTime,
          sportStartTime,
          lastUpdate,
          sportType,
          year,
          home,
          away,
          ...result
        }) => ({
          time: moment(
            sportTime + (sportStartTime === '9999' ? '0000' : sportStartTime),
            'YYYYMMDDHHm',
          ),
          hasStartTime: sportStartTime !== '9999',
          lastUpdate: moment(lastUpdate * 1000),
          keyOnChain: `${sportType}${year}/${sportTime}/${home}-${away}${
            sportStartTime === '9999' ? '' : '/' + sportStartTime
          }`,
          home,
          away,
          homeFullName: getSportTeamByCode(type, home).label,
          awayFullName: getSportTeamByCode(type, away).label,
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

      for (let i = 0; i < Math.ceil(Math.random() * 5); i++) {
        providers[`0x9E07c5d0ed72cE79006A4b88Ab972F8768D3${randNum(4)}`] = {
          name: randStr(5),
          address: `0x9E07c5d0ed72cE79006A4b88Ab972F8768D3${randNum(4)}`,
          lastUpdate: moment(Date.now() - parseInt(randNum(0)) * 86400000),
          status: 'status',
          scoreAway: '130',
          scoreHome: '85',
          home: 'Test',
          away: 'Mock',
        }
      }

      // nodes.forEach(
      //   ({
      //     timestamp,
      //     dataProviderByDataSourceAddressAndTcdAddress: {
      //       dataSourceAddress,
      //       detail,
      //       status,
      //     },
      //     scoreAway,
      //     scoreHome,
      //   }) => {
      //     if (!providers[dataSourceAddress]) {
      //       providers[dataSourceAddress] = {
      //         name: detail,
      //         address: dataSourceAddress,
      //         lastUpdate: moment(timestamp * 1000),
      //         status,
      //         scoreAway,
      //         scoreHome,
      //         home,
      //         away,
      //       }
      //     } else {
      //       if (
      //         providers[dataSourceAddress].scoreAway !== scoreAway ||
      //         providers[dataSourceAddress].scoreHome !== scoreHome
      //       ) {
      //         providers[dataSourceAddress].warning =
      //           'The provider has previously reported different result for this match'
      //       }
      //     }
      //   },
      // )

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
