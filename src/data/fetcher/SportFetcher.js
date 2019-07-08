import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'
import { decodeScores } from 'utils/helper'
import { getProvider } from 'data/Providers'
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
      return prevProps.tcdAddress !== this.props.tcdAddress
    }

    async fetch() {
      const { tcdAddress, tcdPrefix, setNumDataPoints } = this.props

      const sports = await Utils.getDataRequest(`/sports/${tcdAddress}`)
      setNumDataPoints(sports.length)

      return sports
        .sort((s1, s2) => (s1.timestamp > s2.timestamp ? 1 : -1))
        .map(sport => {
          // console.log(sport)
          const home = sport.home
          const away = sport.away
          const [scoreHome, scoreAway] = decodeScores(sport.value)
          return {
            time: moment(new Date(sport.date).getTime()),
            hasStartTime:
              sport.sportStartTime && sport.sportStartTime !== '9999',
            lastUpdate: moment(sport.timestamp * 1000),
            keyOnChain: sport.key,
            home,
            away,
            homeFullName: getSportTeamByCode(tcdPrefix.toUpperCase(), home)
              .label,
            awayFullName: getSportTeamByCode(tcdPrefix.toUpperCase(), away)
              .label,
            scoreAway: scoreAway,
            scoreHome: scoreHome,
          }
        })
    }
  },
)

export const SportProvidersByTypeTimeTeamFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.tcdAddress !== this.props.tcdAddress ||
        prevProps.keyOnChain !== this.props.keyOnChain ||
        prevProps.home !== this.props.home ||
        prevProps.away !== this.props.away
      )
    }

    async fetch() {
      const { tcdAddress, keyOnChain, home, away } = this.props

      const reports = await Utils.getDataRequest(`/${tcdAddress}/data-points`, {
        key: keyOnChain,
      })

      const { reportedData, time } = reports[0] || {
        reportedData: [],
        time: Date.now(),
      }

      const providers = {}
      for (const [k, v] of Object.entries(reportedData)) {
        const { timestamp, value } = v
        const [scoreHome, scoreAway] = decodeScores(value)
        providers[k] = {
          name: getProvider(k).name,
          image: getProvider(k).image,
          address: k,
          away: away,
          home: home,
          lastUpdate: moment(timestamp * 1000),
          scoreAway: scoreAway,
          scoreHome: scoreHome,
          status: 'status',
        }
      }

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
