import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'

const allIdentityFeedQL = (nList, address) => `
{
  allDataIdentityFeedRaws(${
    address === ''
      ? ''
      : `filter: {userAddress: {likeInsensitive: "%${address}%"}},`
  }orderBy: TIMESTAMP_DESC, first: ${nList}) {
    nodes {
      userAddress
      timestamp
    }
  }
}
`

const allIdentityCountQL = () => `
{
    allDataIdentityFeedRaws {
      totalCount
    }
  }  
`

export const IdentityCountFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.location.pathname !== this.props.location.pathname
    }

    async fetch() {
      const {
        allDataIdentityFeedRaws: { totalCount },
      } = await Utils.graphqlRequest(allIdentityCountQL())
      return totalCount
    }
  },
)

export const IdentityFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.location.pathname !== this.props.location.pathname
    }

    async fetch() {
      const { nList, searchAddress } = this.props
      const {
        allDataIdentityFeedRaws: { nodes },
      } = await Utils.graphqlRequest(allIdentityFeedQL(nList, searchAddress))

      return nodes.map(({ userAddress, timestamp }) => ({
        userAddress: userAddress.slice(0, 42),
        timestamp: moment(timestamp * 1000),
      }))
    }
  },
)
