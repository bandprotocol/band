import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { Buffer } from 'buffer'

export const isPositiveNumber = input => {
  if (input.match(/^\d*\.?\d*$/)) return parseInt(input, 10) >= 0
  else return false
}

export const pado = (x, l) => (x.length < l ? pado(x + '0') : x)
export const opad = (x, l) => (x.length < l ? opad('0' + x) : x)

export const convertFromChain = (value, type) => {
  if (!value) return [null, '']
  if (type === 'PERCENTAGE') {
    return [
      BigNumber(value.toString())
        .div(BigNumber(1e16))
        .toFixed(4),
      '%',
    ]
  } else if (type === 'TOKEN') {
    return [
      BigNumber(value.toString())
        .div(BigNumber(1e18))
        .toFixed(4),
      'token',
    ]
  } else if (type === 'ETH') {
    return [
      BigNumber(value.toString())
        .div(BigNumber(1e18))
        .toFixed(4),
      'ETH',
    ]
  } else if (type === 'TIME') {
    const second = BigNumber(value.toString())
    if (second.mod(60 * 60 * 24).isEqualTo(0)) {
      return [second.div(60 * 60 * 24).toFixed(0), 'days']
    } else if (second.mod(60 * 60).isEqualTo(0)) {
      return [second.div(60 * 60).toFixed(0), 'hours']
    } else if (second.mod(60).isEqualTo(0)) {
      return [second.div(60).toFixed(0), 'minutes']
    } else return [second.toFixed(0), 'seconds']
  } else if (type === 'ADDRESS') {
    return ['0x' + opad(BigNumber(value.toString()).toString(16), 40), '']
  } else if (type === 'IPFS') {
    return ['0x' + opad(BigNumber(value.toString()).toString(16), 64), '']
  }
  return [value.toString(), '']
}

export const convertToChain = (value, type, unit) => {
  if (type === 'PERCENTAGE') {
    return new BN(
      BigNumber(value)
        .times(BigNumber(1e16))
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
  return new BN(
    value.startsWith('0x')
      ? BigNumber(value.slice(2), 16).toFixed(0)
      : BigNumber(value).toFixed(0),
  )
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
    name: {
      type: 'IPFS',
      description: 'Name of the community',
    },
    symbol: {
      type: 'IPFS',
      description: 'Symbol of the community',
    },
    description: {
      type: 'IPFS',
      description: 'Description of the community',
    },
    website: {
      type: 'IPFS',
      description: 'Link to website of the community',
    },
    organization: {
      type: 'IPFS',
      description: 'Organization of the community',
    },
    logo: {
      type: 'IPFS',
      description: 'Link to logo of the community',
    },
    banner: {
      type: 'IPFS',
      description: 'Link to banner of the community',
    },
    liquidity_spread: {
      type: 'PERCENTAGE',
      description:
        'The percentage of the spread between buy and sell price of community token',
    },
    revenue_beneficiary: {
      type: 'ADDRESS',
      description:
        'The address of the revenue beneficiary from bonding curve spread',
    },
    max_provider_count: {
      type: 'NUMBER',
      description: 'Maximum number of active providers at any given time',
    },
    min_provider_stake: {
      type: 'TOKEN',
      description: 'Minimum amount of token a provider needs to stake',
    },
    owner_revenue_pct: {
      type: 'PERCENTAGE',
      description: 'Percentage of revenue going directly to data providers',
    },
    query_price: {
      type: 'ETH',
      description: 'Cost of ÐApps to query one data point in ETH',
    },
    inflation_rate: {
      type: 'PERCENTAGE',
      description: 'Percentage of inflation',
    },
    curve_expression: {
      type: 'ADDRESS',
      description: 'Address of expression contract which is used in curve',
    },
    data_aggregator: {
      type: 'ADDRESS',
      description:
        'Address of aggregator contract which is used in Token-Curated DataSources process',
    },
    withdraw_delay: {
      type: 'TIME',
      description: 'Period of time for data provider to with draw their stake',
    },
  }[name] || { type: 'Unknown', description: 'UNKNOWN' })

// convert data format for lottery balls
export const convertToBalls = value => {
  const valueAsHex = new BN(value).toString(16).padStart(64, '0')
  const keys = [
    'whiteBall1',
    'whiteBall2',
    'whiteBall3',
    'whiteBall4',
    'whiteBall5',
    'redBall',
    'mul',
  ]

  return keys.reduce(
    (acc, key, i) => ({
      ...acc,
      [key]: parseInt(valueAsHex.slice(i * 2, i * 2 + 2), 16),
    }),
    {},
  )
}

// convert data format for sport match
export const decodeScores = scores => {
  const bits = new BN(scores)
    .toString(2)
    .padStart(256, '0')
    .slice(0, 16)

  return [
    new BN(bits.slice(0, 8), 2).toNumber(),
    new BN(bits.slice(8), 2).toNumber(),
  ]
}

// convert hex string to parameter array
export const hexToParameters = (variables, types) => {
  let buf = new Buffer(variables, 'hex')
  let parameters = []
  for (const type of types) {
    switch (type) {
      case 'string':
        let res = ''
        while (true) {
          const v = buf.readUInt8(0)
          buf = buf.slice(1)
          if (v === 0) {
            break
          }
          res += String.fromCharCode(v)
        }
        parameters.push(res)
        break
      case 'uint8':
        const v = buf.readUInt8(0)
        buf = buf.slice(1)
        parameters.push(v)
        break
      default:
        console.error('hexToParameter cannot find type')
        break
    }
  }

  return parameters
}

// convert parameters array to hex string
export const parametersToHex = (parameters, types) => {
  let hexString = ''
  for (let i = 0; i < types.length; i++) {
    switch (types[i]) {
      case 'string':
        const param = Buffer.from(parameters[i], 'utf8').toString('hex')
        hexString += `${param}00`
        continue
      case 'uint8':
        if (parameters[i] >= 256) {
          throw new Error('Parameter should be less than 256.')
        }
        const paramAsInt = parseInt(parameters[i])
        if (isNaN(paramAsInt)) throw new Error('Param is not number')
        const paramAsHex = paramAsInt.toString(16).padStart(2, '0')
        hexString += paramAsHex
        continue
      default:
        console.error('parametersToHex cannot find type.')
        continue
    }
  }
  return hexString
}
