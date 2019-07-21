import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils, IPFS } from 'band.js'
import { decodeScores } from 'utils/helper'
import { getProvider } from 'data/Providers'
import axios from 'axios'

export const RequestByTCDFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.tcdAddress !== this.props.tcdAddress
    }

    async fetch() {
      const rawData = await Utils.getDataRequest(
        `/web_requests/${this.props.tcdAddress}`,
      )

      let dataByIpfsHash = {}

      for (const each of rawData) {
        const { key, timestamp, value } = each
        const ipfsHash = key.slice(0, 70)
        const variables = key.slice(70)

        if (!dataByIpfsHash[ipfsHash]) dataByIpfsHash[ipfsHash] = []

        try {
          const { data } = await axios.get(
            `https://ipfs.io/ipfs/${IPFS.toIPFSHash(ipfsHash.slice(6))}`,
          )
          dataByIpfsHash[ipfsHash].push({
            variables,
            value,
            lastUpdate: moment(timestamp * 1000),
            ...data,
          })

          // sort by timestamp (DESC)
          dataByIpfsHash[ipfsHash].sort((a, b) => {
            if (a.lastUpdate.isBefore(b.lastUpdate)) return 1
            else return -1
          })
        } catch (e) {
          console.error(e)
        }
      }

      console.log(dataByIpfsHash)

      return dataByIpfsHash
    }
  },
)

export const Request123ByTCDFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.tcdAddress !== this.props.tcdAddress
    }

    async fetch() {
      const { tcdAddress } = this.props
      const requests = await Utils.getDataRequest(`/web_requests/${tcdAddress}`)
      return await Promise.all(
        requests.map(async request => {
          const result = await axios.get(
            `https://ipfs.io/ipfs/${IPFS.toIPFSHash(request.key.slice(6, 70))}`,
          )

          return {
            ...request,
            data: result.data,
            lastUpdate: moment(request.timestamp * 1000),
            value: Utils.fromBlockchainUnit(request.value),
          }
        }),
      )
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
