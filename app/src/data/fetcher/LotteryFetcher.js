import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { convertToBalls } from 'utils/helper'
import { Utils } from 'band.js'
import { getProvider } from 'data/Providers'

const compareBalls = (a, b) =>
  a.whiteBall1 === b.whiteBall1 &&
  a.whiteBall2 === b.whiteBall2 &&
  a.whiteBall3 === b.whiteBall3 &&
  a.whiteBall4 === b.whiteBall4 &&
  a.whiteBall5 === b.whiteBall5 &&
  a.redBall === b.redBall &&
  a.mul === b.mul

const isNotEqualDate = (a, b) =>
  a.getMonth() !== b.getMonth() || a.getFullYear() !== b.getFullYear()

const formatDate = date =>
  date.getFullYear().toString() +
  (date.getMonth() + 1).toString().padStart(2, '0')

export const LotteryCountByTCDFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.tcdAddress !== this.props.tcdAddress ||
        isNotEqualDate(prevProps.selectedDate, this.props.selectedDate)
      )
    }

    async fetch() {
      const date = formatDate(this.props.selectedDate)
      const lotteriesCount = await Utils.getDataRequest(
        `/lotteries/${this.props.tcdAddress}/count`,
        {
          key: date,
        },
      )
      return lotteriesCount
    }
  },
)

export const LotteyByTCDAddress = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.tcdAddress !== this.props.tcdAddress ||
        prevProps.currentPage !== this.props.currentPage ||
        isNotEqualDate(prevProps.selectedDate, this.props.selectedDate)
      )
    }
    async fetch() {
      const { tcdAddress, currentPage, nLotteryList, selectedDate } = this.props
      const date = formatDate(selectedDate)
      const skip = (currentPage - 1) * nLotteryList
      const params =
        skip > 0
          ? {
              limit: nLotteryList,
              skip,
              key: date,
            }
          : {
              limit: nLotteryList,
              key: date,
            }
      const rawData = await Utils.getDataRequest(
        `/lotteries/${tcdAddress}`,
        params,
      )
      return rawData.map(({ date, key, timestamp, value }) => {
        return {
          time: moment(date),
          lastUpdate: moment(timestamp * 1000),
          keyOnChain: key,
          ...convertToBalls(value),
        }
      })
    }
  },
)

export const LotteryProvidersByTCDAddressTimeFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.tcdAddress !== this.props.tcdAddress ||
        prevProps.keyOnChain !== this.props.keyOnChain
      )
    }

    async fetch() {
      const { tcdAddress, keyOnChain } = this.props
      const reports = await Utils.getDataRequest(`/${tcdAddress}/data-points`, {
        key: keyOnChain,
      })

      if (reports.length === 0) {
        return []
      }

      // Aggregate results and see if the provider has reported maliciously
      const { reportedData } = reports[0]

      return Object.keys(reportedData).map(address => {
        const providerInfo = getProvider(address)
        return {
          name: providerInfo.name,
          image: providerInfo.image,
          status: 'status',
          address,
          lastUpdate: moment(reportedData[address].timestamp * 1000),
          ...convertToBalls(reportedData[address].value),
        }
      })
    }
  },
)
