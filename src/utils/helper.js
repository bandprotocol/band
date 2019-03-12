import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export const isPositiveNumber = input => {
  return input.match(/^\d*\.?\d*$/) && parseInt(input, 10) >= 0
}

export const convertFromChain = (value, type, unit) => {
  if (type === 'PERCENTAGE') {
    return BigNumber(value.toString())
      .div(BigNumber(1e12))
      .toNumber()
  } else if (type === 'TOKEN') {
    return BigNumber(value.toString())
      .div(BigNumber(1e18))
      .toNumber()
  } else if (type === 'TIME') {
    const second = BigNumber(value.toString()).toNumber()
    switch (unit) {
      case 'minute':
        return second / 60
      case 'hour':
        return second / 60 / 60
      case 'day':
        return second / 60 / 60 / 24
      default:
        return second
    }
  }
}

export const convertToChain = (value, type, unit) => {
  if (type === 'PERCENTAGE') {
    return new BN(
      BigNumber(value)
        .times(BigNumber(1e12))
        .toFixed(0),
    )
  } else if (type === 'TOKEN') {
    return new BN(
      BigNumber(value)
        .times(BigNumber(1e18))
        .toFixed(0),
    )
  } else if (type === 'TIME') {
    const bigTime = BigNumber(value)
    switch (unit) {
      case 'minute':
        return new BN(bigTime.times(60).toFixed(0))
      case 'hour':
        return new BN(bigTime.times(60 * 60).toFixed(0))
      case 'day':
        return new BN(bigTime.times(60 * 60 * 24).toFixed(0))
      default:
        return new BN(bigTime.toFixed(0))
    }
  }
}

export const getUnitFromType = type => {
  if (type === 'PERCENTAGE') return '%'
  else if (type === 'TOKEN') return 'token'
  else if (type === 'TIME') return 'hour'
}
