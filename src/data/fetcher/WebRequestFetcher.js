import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils, IPFS } from 'band.js'
import axios from 'axios'
import BN from 'utils/bignumber'

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
          const { multiplier } = data.response
          dataByIpfsHash[ipfsHash].push({
            variables,
            value: new BN(value).divideToFixed(multiplier || 1, 2),
            lastUpdate: moment(timestamp * 1000),
            keyOnChain: key,
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

      return dataByIpfsHash
    }
  },
)
