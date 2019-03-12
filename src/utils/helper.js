import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export const isPositiveNumber = input => {
  return input.match(/^\d*\.?\d*$/) && parseInt(input, 10) >= 0
}

export const convertFromChain = (value, type, unit) => {
  if (type === 'PERCENTAGE') {
    return BigNumber(value.toString())
      .div(BigNumber(1e12))
      .toFixed(2)
  } else if (type === 'TOKEN') {
    return BigNumber(value.toString())
      .div(BigNumber(1e18))
      .toFixed(2)
  } else if (type === 'TIME') {
    const second = BigNumber(value.toString())
    switch (unit) {
      case 'minute':
        return second.div(60).toFixed(2)
      case 'hour':
        return second.div(60 * 60).toFixed(2)
      case 'day':
        return second.div(60 * 60 * 24).toFixed(2)
      default:
        return second.toFixed(0)
    }
  } else if (type === 'ADDRESS') {
    return '0x' + BigNumber(value.toString()).toString(16)
  }
  return value.toString()
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
  } else if (type === 'ADDRESS') {
    const hexString = value.startsWith('0x') ? value.slice(2) : value
    return new BN(BigNumber(hexString, 16).toFixed(0))
  }
}

export const getUnitFromType = type => {
  if (type === 'PERCENTAGE') return '%'
  else if (type === 'TOKEN') return 'token'
  else if (type === 'TIME') return 'minute'
  else if (type === 'ADDRESS') return ''
}

export const getParameterType = name =>
  ({
    admin_contract: 'ADDRESS',
    reward_edit_period: 'TIME',
    reward_period: 'TIME',
    expiration_time: 'TIME',
    min_participation_pct: 'PERCENTAGE',
    support_required_pct: 'PERCENTAGE',
    apply_stage_length: 'TIME',
    commit_time: 'TIME',
    dispensation_percentage: 'PERCENTAGE',
    min_deposit: 'TOKEN',
    reveal_time: 'TIME',
  }[name])
