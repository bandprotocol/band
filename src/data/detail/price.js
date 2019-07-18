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
