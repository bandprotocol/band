import moment from 'moment'

moment.prototype.formal = function() {
  const localTime = this.local()
  return localTime.format('DD-MM-YYYY HH:mm:ss')
}

moment.prototype.priceDate = function() {
  const localTime = this.local()
  return localTime.format('dddd, MM DD YYYY, HH:mm:ss')
}

moment.prototype.pretty = function() {
  const today = moment().startOf('day')
  const yesterday = moment()
    .startOf('day')
    .subtract(1, 'day')

  const localTime = this.local()

  if (this.isAfter(today)) {
    return localTime.fromNow()
  } else if (localTime.isAfter(yesterday)) {
    return `Yesterday at ${localTime.format('hh:mm a')}`
  } else {
    return localTime.format('MMM D [at] hh:mm a')
  }
}

moment.prototype.prettyRough = function() {
  const today = moment().startOf('day')
  const yesterday = moment()
    .startOf('day')
    .subtract(1, 'day')

  const localTime = this.local()

  if (this.isAfter(today)) {
    return 'Today'
  } else if (localTime.isAfter(yesterday)) {
    return 'Yesterday'
  } else {
    return localTime.format('MMM D, YYYY')
  }
}

export default moment
