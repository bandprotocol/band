const allProviders = {
  '0xdA7af0fD57c5D2e918704f034fd9e13aEB28Ad13': {
    name: 'Coinbase',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png',
  },
  '0xda7a01d6d7568868b21a6789968B06Bb3af5c191': {
    name: 'Bitstamp',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/70.png',
  },
  '0xDa7A2A9C0bB0F94f9ddF54Dde3dBE2530A8269A2': {
    name: 'Bitfinex',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/37.png',
  },
  '0xDa7A90B4b2078e0446974014C319157ab02c24b7': {
    name: 'Bittrex',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/22.png',
  },
  '0xDA7A2E3d741f025010C44AfA2A6a7353F70D6b23': {
    name: 'Gemini',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/151.png',
  },
  '0xda7A6811d4dd6A6b0f0EF1f1FE2f99ECd0cE9b7A': {
    name: 'Kraken',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/24.png',
  },
  '0xdA7af2D3f2321e815CF3841Bd0d9A889dE22E37C': {
    name: 'CoinMarketCap',
    image: 'https://cryptwerk.com/upload/companies/0/coinmarketcap.jpg',
  },
  '0xDA7a814e8B96417274466E2492298B039A854a8C': {
    name: 'CryptoCompare',
    image: 'https://www.cryptocompare.com/media/20567/cc-logo-vert.png',
  },
  '0xdA7A6db349b7ae544234f91Abd01dd825b8969cD': {
    name: 'OpenMarketCap',
    image: 'https://i.imgur.com/H9rCov0.gif',
  },
  '0xda7adB240Fb99dCD55e19a17B97ac2163d4d4509': {
    name: 'OnchainFX',
    image: 'https://i.imgur.com/LqAxlFA.jpg',
  },
  '0xdA7A3C7309Bd2De2e89a554191b2d7c71125186c': {
    name: 'Bancor Protocol',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/267.png',
  },
  '0xDa7AeEc22311453193C55af63EF7F2df4E6A73D2': {
    name: 'Kyber Network',
    image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/404.png',
  },
  '0xdA7A7F095BE77012679df0744D8a163823C0558E': {
    name: 'Uniswap Protocol',
    image: 'https://i.imgur.com/CuqYxat.png',
  },
  '0xdA7aa2bbA8685F9C0dDBC53aB8e19A6A32dc8b7F': {
    name: 'Free Forex API',
    image: 'http://www.freeforexapi.com/images/logo2.png',
  },
  '0xDA7a79196DDD8AD788a996eFaFeA15bf0879c31c': {
    name: 'Alpha Vantage',
    image: 'https://www.alphavantage.co/static/img/favicon.ico',
  },
  '0xDa7Af1118c2C5F2edb0d452a84bE91E7b47014cb': {
    name: 'Currency Converter API',
    image: 'https://www.currencyconverterapi.com/images/logo.png',
  },
  '0xdA7a238d208eda262505D43678b7d7f180A9Ee69': {
    name: 'Rates API',
    image: 'https://ratesapi.io/images/support.png',
  },
  '0xDa7aE92EF9089f9093e9555B6cf2fd3E29e3D6d7': {
    name: 'Financial Modeling Prep',
    image: 'https://i.imgur.com/sroTyfS.png',
  },
  '0xda7Aa81514ae2108Da300639d46aa399abAEfA05': {
    name: 'World Trading Data',
    image:
      'https://www.worldtradingdata.com/assets/main/img/favicons/favicon-96x96.png',
  },
  default: { name: 'Unknown' },
}

export const getProvider = address =>
  allProviders[address] || allProviders.default

export const searchProviderAddress = query => {
  const _query = query.trim().toLowerCase()
  const match = Object.entries(allProviders).find(
    ([address, { name }]) =>
      address.toLowerCase().includes(_query) ||
      name.toLowerCase().includes(_query),
  )

  return match ? match[0] : undefined
}
