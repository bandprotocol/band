import BigNumber from 'bignumber.js'
// import { web3 } from '../web3'

const DIVISOR = BigNumber(10).pow(18)

BigNumber.prototype.pretty = function() {
  return this.div(DIVISOR).toFixed(2)
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
