import moment from 'moment'
export const formatData = rawData => {
  const timestamp = rawData.ts * 1000
  const value = Number(parseFloat(rawData.px / 1e18).toFixed(4))
  return [timestamp, value]
}

export const formatDateUTC = UTC => {
  const stillUtc = moment.unix(UTC)
  const local = stillUtc.local().format('DD/MM/YYYY-HH:mm:ss')
  return local
}

export const formatPrice = value => {
  if (value >= 1) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } else {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })
  }
}
