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

        // Hack filter unused
        if (
          ipfsHash ===
            '0x12200f143db78f38627608ecf9b051cd84a2cb3030e3bc7f36739b5b3b8ec7ccdf1d' ||
          key ===
            '0x1220a9ab69e5da8ac5e378796cef1d9cda4f38d9f42e77ef5aebfceeaf33334de0ed637a5f62696e616e6365006761766f66796f726b00'
        )
          continue

        if (!dataByIpfsHash[ipfsHash]) dataByIpfsHash[ipfsHash] = []
        try {
          const ipfsPath = IPFS.toIPFSHash(ipfsHash.slice(6))
          const { data } = await axios.get(`https://ipfs.io/ipfs/${ipfsPath}`)
          const { multiplier } = data.response
          dataByIpfsHash[ipfsHash].push({
            variables,
            value: new BN(value).divideToFixed(multiplier || 1, 2),
            lastUpdate: moment(timestamp * 1000),
            keyOnChain: key,
            ipfsPath,
            ...data,
          })

          // sorted by timestamp's parameter has called lastest.
          dataByIpfsHash[ipfsHash].sort((a, b) => {
            if (a.lastUpdate.isBefore(b.lastUpdate)) return 1
            else return -1
          })
        } catch (e) {
          console.error(e)
        }
      }

      const sortedIpfsHash = Object.entries(dataByIpfsHash).map(
        ([key, value]) => {
          return {
            key,
            value,
            lastUpdate: value[0].lastUpdate,
          }
        },
      )
      sortedIpfsHash.sort((a, b) => {
        if (a.lastUpdate.isBefore(b.lastUpdate)) return 1
        return -1
      })
      // console.log(dataByIpfsHash)
      // console.log(sortedIpfsHash)

      return sortedIpfsHash
    }
  },
)
