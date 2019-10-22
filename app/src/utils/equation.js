import BN from 'utils/bignumber'
import Bignumber from 'bignumber.js'

export const calculateCollateralAt = (self, value, curveMultiplier) => {
  const val = Bignumber(value.toString())
    .div(Bignumber(10).pow(18))
    .pow(10)
  const eq = Bignumber(10)
    .pow(64)
    .multipliedBy(5)

  return new BN(
    val
      .multipliedBy(Bignumber(curveMultiplier.toString()))
      .div(eq)
      .toFixed(0),
  )
}
