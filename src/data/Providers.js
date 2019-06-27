export const getProvider = address =>
  ({
    '0xdA7af0fD57c5D2e918704f034fd9e13aEB28Ad13': {
      name: 'COINBASE',
    },
    '0xda7a01d6d7568868b21a6789968B06Bb3af5c191': {
      name: 'BITSTAMP',
    },
    '0xDa7A2A9C0bB0F94f9ddF54Dde3dBE2530A8269A2': {
      name: 'BITFINEX',
    },
    '0xDa7A90B4b2078e0446974014C319157ab02c24b7': {
      name: 'BITTREX',
    },
    '0xDA7A2E3d741f025010C44AfA2A6a7353F70D6b23': {
      name: 'GEMINI',
    },
    '0xda7A6811d4dd6A6b0f0EF1f1FE2f99ECd0cE9b7A': {
      name: 'KRAKEN',
    },
    '0xdA7af2D3f2321e815CF3841Bd0d9A889dE22E37C': {
      name: 'CMC',
    },
    '0xDA7a814e8B96417274466E2492298B039A854a8C': {
      name: 'CRYPTOCOMPARE',
    },
    '0xdA7A6db349b7ae544234f91Abd01dd825b8969cD': {
      name: 'OPENMARKETCAP',
    },
    '0xda7adB240Fb99dCD55e19a17B97ac2163d4d4509': {
      name: 'ONCHAINFX',
    },
    '0xdA7A3C7309Bd2De2e89a554191b2d7c71125186c': {
      name: 'BANCOR',
    },
    '0xDa7AeEc22311453193C55af63EF7F2df4E6A73D2': {
      name: 'KYBER',
    },
    '0xdA7A7F095BE77012679df0744D8a163823C0558E': {
      name: 'UNISWAP',
    },
    '0xdA7aa2bbA8685F9C0dDBC53aB8e19A6A32dc8b7F': {
      name: 'FREE_FOREX',
    },
    '0xDA7a79196DDD8AD788a996eFaFeA15bf0879c31c': {
      name: 'ALPHAVANTAGE',
    },
    '0xDa7Af1118c2C5F2edb0d452a84bE91E7b47014cb': {
      name: 'CURRENCY_CONVERTER_API',
    },
    '0xdA7a238d208eda262505D43678b7d7f180A9Ee69': {
      name: 'API_RATESAPI_IO',
    },
    '0xDa7aE92EF9089f9093e9555B6cf2fd3E29e3D6d7': {
      name: 'FINANCIAL_MODELING_PREP',
    },
    '0xda7Aa81514ae2108Da300639d46aa399abAEfA05': {
      name: 'WORLD_TRADING_DATA',
    },
  }[address] || { name: 'Unknown' })
