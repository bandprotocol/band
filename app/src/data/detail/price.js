export const CRYPTO_TYPE = 'CRYPTO'
export const FX_TYPE = 'FX'
export const USEQUITY_TYPE = 'USEQUITY'
export const ERC20_TYPE = 'ERC20'

const allPrices = {
  crypto: [
    { name: 'BCH/USD' },
    { name: 'BTC/USD' },
    { name: 'ETH/USD' },
    { name: 'LTC/USD' },
    { name: 'XRP/USD' },
  ],
  erc20: [
    { name: 'BAT/ETH' },
    { name: 'DAI/ETH' },
    { name: 'KNC/ETH' },
    { name: 'LINK/ETH' },
    { name: 'MKR/ETH' },
    { name: 'OMG/ETH' },
    { name: 'REP/ETH' },
    { name: 'USDC/ETH' },
    { name: 'ZRX/ETH' },
  ],
  fx: [
    { name: 'CNY/USD' },
    { name: 'EUR/USD' },
    { name: 'GBP/USD' },
    { name: 'JPY/USD' },
    { name: 'THB/USD' },
    { name: 'XAG/USD' },
    { name: 'XAU/USD' },
  ],
  useq: [
    { name: 'AAPL/USD' },
    { name: 'AMZN/USD' },
    { name: 'FB/USD' },
    { name: 'GOOG/USD' },
    { name: 'INTC/USD' },
    { name: 'MSFT/USD' },
    { name: 'NFLX/USD' },
    { name: 'NVDA/USD' },
    { name: 'ORCL/USD' },
    { name: 'SBUX/USD' },
  ],
  default: [{ name: 'Unknown' }],
}

export const getPriceKeys = prefix => allPrices[prefix] || allPrices.default

const allPricesLabel = {
  [CRYPTO_TYPE]: ['BCH-USD', 'BTC-USD', 'ETH-USD', 'LTC-USD', 'XRP-USD'],
  [FX_TYPE]: ['CNY', 'EUR', 'GBP', 'JPY', 'THB', 'XAG', 'XAU'],
  [ERC20_TYPE]: [
    'BAT-ETH',
    'DAI-ETH',
    'KNC-ETH',
    'LINK-ETH',
    'MKR-ETH',
    'OMG-ETH',
    'REP-ETH',
    'USDC-ETH',
    'ZRX-ETH',
  ],
  [USEQUITY_TYPE]: ['AAPL', 'AMZN', 'FB', 'GOOG', 'MSFT', 'NFLX', 'ORCL'],
}

export const getAllPriceLabelFromType = type =>
  allPricesLabel[type] ||
  Object.keys(allPricesLabel).reduce(
    (acc, key) => acc.concat(allPricesLabel[key]),
    [],
  )
