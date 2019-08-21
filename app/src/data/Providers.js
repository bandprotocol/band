const allProviders = {
  '0xDa7A7bd990030359e4E30E41ba0e5b33f740Db47': {
    name: 'USA_Node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/5b/Greater_coat_of_arms_of_the_United_States.svg',
  },
  '0xDA7a8AFb5035045A58eeDEcC6B6F26247C8f20F5': {
    name: 'EU_Node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
  },
  '0xDa7AfF0D0142eA8a6Df33bA9e6307922c7838489': {
    name: 'SEA_Node',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/49/Seal_of_ASEAN.svg',
  },
  '0xDA7A1dDCE143C2460Bd2536607ea38309D7c45Ca': {
    name: 'SPORTS_DB',
    image: 'https://i.imgur.com/GsZ6avc.png',
  },
  '0xda7AdcB9b801952019f8d44889A9F4038443dD97': {
    name: 'DATA_NBA',
    image:
      'https://cdn.freebiesupply.com/images/large/2x/nba-logo-transparent.png',
  },
  '0xdA7a80e66A96ae364918aE7fcf2F9cA03e2a2D5d': {
    name: 'ESPN',
    image: 'https://i.imgur.com/QsU7xqB.png',
  },
  '0xdA7af0fD57c5D2e918704f034fd9e13aEB28Ad13': {
    name: 'Coinbase',
    image: 'https://assets.coinbase.com/exchange/favicon.ico',
  },
  '0xda7a01d6d7568868b21a6789968B06Bb3af5c191': {
    name: 'Bitstamp',
    image: 'https://www.bitstamp.net/s/webapp/images/meta/apple-touch-icon.png',
  },
  '0xDa7A2A9C0bB0F94f9ddF54Dde3dBE2530A8269A2': {
    name: 'Bitfinex',
    image: 'https://www.bitfinex.com/assets/favicon.ico',
  },
  '0xDa7A90B4b2078e0446974014C319157ab02c24b7': {
    name: 'Bittrex',
    image:
      'https://raw.githubusercontent.com/Bittrex/bittrex.github.io/master/favicon.ico',
  },
  '0xDA7A2E3d741f025010C44AfA2A6a7353F70D6b23': {
    name: 'Gemini',
    image:
      'https://gemini.com/wp-content/uploads/2016/02/gemini_symbol_rgb.png',
  },
  '0xda7A6811d4dd6A6b0f0EF1f1FE2f99ECd0cE9b7A': {
    name: 'Kraken',
    image: 'https://www.kraken.com/img/favicon.ico?v=2',
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
    image: 'https://www.bancor.network/static/images/favicon.ico',
  },
  '0xDa7AeEc22311453193C55af63EF7F2df4E6A73D2': {
    name: 'Kyber Network',
    image: 'https://kyber.network/favicon-32x32.png',
  },
  '0xdA7A7F095BE77012679df0744D8a163823C0558E': {
    name: 'Uniswap Protocol',
    image: 'https://i.imgur.com/CuqYxat.png',
  },
  '0xdA7aa2bbA8685F9C0dDBC53aB8e19A6A32dc8b7F': {
    name: 'Free Forex API',
    image: 'https://www.freeforexapi.com/images/logo2.png',
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
  '0xDA7A08e515dAb7cEc794f804Ce2B1c850FF19b7f': {
    name: 'Megamillions',
    image: 'https://www.ialottery.com/images/game-logos/megamillions-large.gif',
  },
  '0xDa7a198618105fd301958cA76548Ce9Ea5D1De42': {
    name: 'Data NY Government',
    image:
      'https://i2.wp.com/www.nysgis.net/wp-content/uploads/2016/09/nyslogo_418x200.png',
  },
  '0xdA7Ad157EdA297C1412BBdBe0E3600670e4560F6': {
    name: 'Powerball',
    image:
      'https://s3.amazonaws.com/cdn.powerball.com/drupal/files/2019-03/Powerball%20Power%20Play_7.png',
  },
  '0xDa7ABa879e90113d6E950Cb1f7908F7b4CA52d8C': {
    name: 'Band Reserved Provider',
    image: 'https://app.kovan.bandprotocol.com/favicon.png',
  },
  '0xDa7AFDeE902A41769479349373EF24D19368a9f1': {
    name: 'USA node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/5b/Greater_coat_of_arms_of_the_United_States.svg',
  },
  '0xDA7afa8f087AA2571276b17dBe45A4097C380eff': {
    name: 'EU node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
  },
  '0xdA7Af7Ce7baD1454bdB96507Fb73b7478A345e3b': {
    name: 'SEA node',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/49/Seal_of_ASEAN.svg',
  },
  '0xDa7a1eD9Df0cC9dFF132d9C3FFC6d76807C14E4b': {
    name: 'USA node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/5b/Greater_coat_of_arms_of_the_United_States.svg',
  },
  '0xDa7A1277D77ffE97628474dce34A903c97822cbb': {
    name: 'EU node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
  },
  '0xda7a1331BD1d0283bac9Bb06a2BE0714901c22b0': {
    name: 'SEA node',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/49/Seal_of_ASEAN.svg',
  },
  '0xdA7A5879fd7956f3869eCD21B6f58b2aFDD1a1bc': {
    name: 'USA node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/5b/Greater_coat_of_arms_of_the_United_States.svg',
  },
  '0xDa7a5d4F189CcB60CA5c9243348D7086e9EaD434': {
    name: 'EU node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
  },
  '0xDA7A51d45A6fA2C9ed66EB568b9F8aB34f011001': {
    name: 'SEA node',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/49/Seal_of_ASEAN.svg',
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
