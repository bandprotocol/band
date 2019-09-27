import BigNumber from 'bignumber.js'
import BN from 'bn.js'

const DIVISOR = BigNumber(10).pow(18)
const THOUSAND = BigNumber(10).pow(3)
const MILLION = BigNumber(10).pow(6)
const BILLION = BigNumber(10).pow(9)

BN.prototype.pretty = function(digits) {
  if (digits === undefined) digits = 2
  const result = BigNumber(this.toString())
    .plus(MILLION)
    .div(DIVISOR)
    .toFixed(18)
  return result.slice(0, result.length - (18 - digits))
  // .toLocaleString('en-US', {
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // })
}

BN.prototype.shortPretty = function() {
  const value = BigNumber(this.toString()).div(DIVISOR)
  if (value.gte(BILLION))
    return value
      .div(BILLION)
      .toFixed(2)
      .concat('B')
  else if (value.gte(MILLION))
    return value
      .div(MILLION)
      .toFixed(2)
      .concat('M')
  else if (value.gte(THOUSAND))
    return value
      .div(THOUSAND)
      .toFixed(2)
      .concat('K')
  else return value.toFixed(2)
}

BN.prototype.communityToBand = function(communityPrice) {
  return new BN(
    BigNumber(this.toString())
      .multipliedBy(BigNumber(communityPrice))
      .toFixed(0),
  )
}

BN.prototype.bandToUSD = function(bandPrice) {
  return new BN(
    BigNumber(this.toString())
      .multipliedBy(BigNumber(bandPrice))
      .toFixed(0),
  )
}

BN.parse = function(value) {
  if (BN.isBN(value)) {
    return value
  } else if (typeof value === 'string') {
    if (value === '') throw new Error('Cannot parse empty string.')
    return new BN(value)
  } else {
    return new BN(DIVISOR.times(BigNumber(value)).toFixed(0))
  }
}

BN.prototype.calculatePrice = function(amount) {
  return new BN(
    BigNumber(this.toString())
      .div(BigNumber(amount.toString()))
      .times(DIVISOR)
      .toFixed(0),
  ).pretty()
}

BN.prototype.clamp = function(max, min) {
  if (this.gte(max)) {
    return new BN(max)
  } else if (this.lte(min)) {
    return new BN(min)
  } else {
    return this
  }
}

BN.prototype.divideToFixed = function(divider, digits = 2) {
  let dividerBig = BN.isBN(divider)
    ? BigNumber(divider.toString())
    : BigNumber(divider)
  return BigNumber(this.toString())
    .dividedBy(dividerBig)
    .toFixed(digits)
}

BN.prototype.calculateChanged = function(pastValue) {
  const currentValue = BigNumber(this.toString())
  return currentValue
    .minus(BigNumber(pastValue.toString()))
    .dividedBy(BigNumber(pastValue.toString()))
    .multipliedBy(100)
    .toNumber()
}

BN.prototype.applyPercentage = function(percent) {
  return new BN(
    BigNumber(this.toString())
      .multipliedBy(BigNumber(percent))
      .dividedBy(100)
      .toFixed(0),
  )
}

window.BN = BN
export default BN
