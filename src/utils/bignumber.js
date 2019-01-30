import BigNumber from 'bignumber.js'

const DIVISOR = BigNumber(10).pow(18)

BigNumber.prototype.pretty = function() {
  return this.div(DIVISOR)
    .toNumber()
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximunFractionDigits: 2,
    })
}

// BigNumber.prototype.hex = function() {
//   return ('0'.repeat(64) + web3.utils.fromDecimal(this).substring(2)).substr(
//     -64,
//   )
// }

BigNumber.parse = function(value) {
  return BigNumber(DIVISOR.times(BigNumber(value)))
}

window.BigNumber = BigNumber
export default BigNumber
