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

BN.parse = function(value) {
  if (BN.isBN(value)) {
    return value
  } else {
    return new BN(DIVISOR.times(BigNumber(value)).toFixed(0))
  }
}

window.BN = BN
export default BN
