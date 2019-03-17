import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export const isPositiveNumber = input => {
  return input.match(/^\d*\.?\d*$/) && parseInt(input, 10) >= 0
}

export const convertFromChain = (value, type, unit) => {
  if (!value) return null
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
      case 'minutes':
        return second.div(60).toFixed(0)
      case 'hours':
        return second.div(60 * 60).toFixed(0)
      case 'days':
        return second.div(60 * 60 * 24).toFixed(0)
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
      case 'minutes':
        return new BN(bigTime.times(60).toFixed(0))
      case 'hours':
        return new BN(bigTime.times(60 * 60).toFixed(0))
      case 'days':
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
  else if (type === 'TOKEN') return 'tokens'
  else if (type === 'TIME') return 'minutes'
  else if (type === 'ADDRESS') return ''
}

export const getParameterDetail = name =>
  ({
    admin_contract: {
      type: 'ADDRESS',
      description: 'The address of admin contract',
    },
    reward_edit_period: {
      type: 'TIME',
      description: 'The duration in second that admin can re submit reward',
    },
    reward_period: {
      type: 'TIME',
      description: 'The duration in second for each period reward',
    },
    expiration_time: {
      type: 'TIME',
      description:
        'The duration in seconds during which token holders can votes for a particular challenge.',
    },
    min_participation_pct: {
      type: 'PERCENTAGE',
      description:
        'The percentage of votes required to consider a poll can conclude.',
    },
    support_required_pct: {
      type: 'PERCENTAGE',
      description:
        'The percentage of votes required to consider a challenge to be successful.',
    },
    apply_stage_length: {
      type: 'TIME',
      description:
        'The duration in seconds that an operator application can be challenged before it is considered accepted.',
    },
    commit_time: {
      type: 'TIME',
      description:
        'The duration in seconds during which token holders can commit votes for a particular challenge.',
    },
    dispensation_percentage: {
      type: 'PERCENTAGE',
      description:
        'The percentage of the reward pool in a challenge which is awarded to the winning party. Must be between 50% (the stake amount) to 100% (the total reward pool).',
    },
    min_deposit: {
      type: 'TOKEN',
      description:
        'The number of tokens an operator must deposit for their application and for the duration of their position.',
    },
    reveal_time: {
      type: 'TIME',
      description:
        'The duration in seconds during which token holders can reveal committed votes for a particular challenge.',
    },
  }[name])
