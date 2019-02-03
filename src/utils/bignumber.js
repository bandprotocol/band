import BigNumber from 'bignumber.js'
import BN from 'bn.js'

const DIVISOR = BigNumber(10).pow(18)

BN.prototype.pretty = function() {
  return BigNumber(this.toString())
    .div(DIVISOR)
    .toNumber()
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximunFractionDigits: 2,
    })
}

BN.prototype.communityToBand = function(communityPrice) {
  return new BN(
    BigNumber(this.toString())
      .multipliedBy(BigNumber(communityPrice.toString()).dividedBy(DIVISOR))
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
  } else {
    if (value === '') throw new Error('Cannot parse empty string.')
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

window.BN = BN
export default BN
