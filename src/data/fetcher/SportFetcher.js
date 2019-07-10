import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'
import { decodeScores } from 'utils/helper'
import { getProvider } from 'data/Providers'
import { getSportTeamByCode } from 'utils/sportTeam'

export const SportCountByTCDFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.tcdAddress !== this.props.tcdAddress
    }

    async fetch() {
      const sports = await Utils.getDataRequest(
        `/sports/${this.props.tcdAddress}`,
      )
      return sports.length
    }
  },
)

export const SportByTCDFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.tcdAddress !== this.props.tcdAddress ||
        prevProps.currentPage !== this.props.currentPage
      )
    }

    async fetch() {
      const { tcdAddress, tcdPrefix, currentPage, nSportList } = this.props
      const skip = (currentPage - 1) * nSportList
      const params =
        skip > 0
          ? {
              limit: nSportList,
              skip,
            }
          : {
              limit: nSportList,
            }
      const sports = await Utils.getDataRequest(`/sports/${tcdAddress}`, params)

      return sports.map(sport => {
        const home = sport.home
        const away = sport.away
        const [scoreHome, scoreAway] = decodeScores(sport.value)
        return {
          time: moment(new Date(sport.date).getTime()),
          hasStartTime: sport.sportStartTime && sport.sportStartTime !== '9999',
          lastUpdate: moment(sport.timestamp * 1000),
          keyOnChain: sport.key,
          home,
          away,
          homeFullName: getSportTeamByCode(tcdPrefix.toUpperCase(), home).label,
          awayFullName: getSportTeamByCode(tcdPrefix.toUpperCase(), away).label,
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
