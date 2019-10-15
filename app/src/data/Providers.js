import Antelope from 'images/animals/antelope.svg'
import Elephant from 'images/animals/elephant.svg'
import Octopus from 'images/animals/octopus.svg'
import Panda from 'images/animals/panda.svg'
import Penguin from 'images/animals/penguin.svg'
import Puma from 'images/animals/puma.svg'
import Walrus from 'images/animals/walrus.svg'
import Band from 'images/band.svg'

const allProviders = {
  '0xda7a7bd990030359e4e30e41ba0e5b33f740db47': {
    name: 'USA_Node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/5b/Greater_coat_of_arms_of_the_United_States.svg',
  },
  '0xda7a8afb5035045a58eedecc6b6f26247c8f20f5': {
    name: 'EU_Node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
  },
  '0xda7aff0d0142ea8a6df33ba9e6307922c7838489': {
    name: 'SEA_Node',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/49/Seal_of_ASEAN.svg',
  },
  '0xda7a1ddce143c2460bd2536607ea38309d7c45ca': {
    name: 'SPORTS_DB',
    image: 'https://i.imgur.com/GsZ6avc.png',
  },
  '0xda7adcb9b801952019f8d44889a9f4038443dd97': {
    name: 'DATA_NBA',
    image:
      'https://cdn.freebiesupply.com/images/large/2x/nba-logo-transparent.png',
  },
  '0xda7a80e66a96ae364918ae7fcf2f9ca03e2a2d5d': {
    name: 'ESPN',
    image: 'https://i.imgur.com/QsU7xqB.png',
  },
  '0xda7af0fd57c5d2e918704f034fd9e13aeb28ad13': {
    name: 'Coinbase',
    image: 'https://assets.coinbase.com/exchange/favicon.ico',
  },
  '0xda7a01d6d7568868b21a6789968b06bb3af5c191': {
    name: 'Bitstamp',
    image: 'https://www.bitstamp.net/s/webapp/images/meta/apple-touch-icon.png',
  },
  '0xda7a2a9c0bb0f94f9ddf54dde3dbe2530a8269a2': {
    name: 'Bitfinex',
    image: 'https://www.bitfinex.com/assets/favicon.ico',
  },
  '0xda7a90b4b2078e0446974014c319157ab02c24b7': {
    name: 'Bittrex',
    image:
      'https://raw.githubusercontent.com/Bittrex/bittrex.github.io/master/favicon.ico',
  },
  '0xda7a2e3d741f025010c44afa2a6a7353f70d6b23': {
    name: 'Gemini',
    image:
      'https://gemini.com/wp-content/uploads/2016/02/gemini_symbol_rgb.png',
  },
  '0xda7a6811d4dd6a6b0f0ef1f1fe2f99ecd0ce9b7a': {
    name: 'Kraken',
    image: 'https://www.kraken.com/img/favicon.ico?v=2',
  },
  '0xda7af2d3f2321e815cf3841bd0d9a889de22e37c': {
    name: 'CoinMarketCap',
    image: 'https://cryptwerk.com/upload/companies/0/coinmarketcap.jpg',
  },
  '0xda7a814e8b96417274466e2492298b039a854a8c': {
    name: 'CryptoCompare',
    image: 'https://www.cryptocompare.com/media/20567/cc-logo-vert.png',
  },
  '0xda7a6db349b7ae544234f91abd01dd825b8969cd': {
    name: 'OpenMarketCap',
    image: 'https://i.imgur.com/H9rCov0.gif',
  },
  '0xda7adb240fb99dcd55e19a17b97ac2163d4d4509': {
    name: 'OnchainFX',
    image: 'https://i.imgur.com/LqAxlFA.jpg',
  },
  '0xda7a3c7309bd2de2e89a554191b2d7c71125186c': {
    name: 'Bancor Protocol',
    image: 'https://www.bancor.network/static/images/favicon.ico',
  },
  '0xda7aeec22311453193c55af63ef7f2df4e6a73d2': {
    name: 'Kyber Network',
    image: 'https://kyber.network/favicon-32x32.png',
  },
  '0xda7a7f095be77012679df0744d8a163823c0558e': {
    name: 'Uniswap Protocol',
    image: 'https://i.imgur.com/CuqYxat.png',
  },
  '0xda7aa2bba8685f9c0ddbc53ab8e19a6a32dc8b7f': {
    name: 'Free Forex API',
    image: 'https://www.freeforexapi.com/images/logo2.png',
  },
  '0xda7a79196ddd8ad788a996efafea15bf0879c31c': {
    name: 'Alpha Vantage',
    image: 'https://www.alphavantage.co/static/img/favicon.ico',
  },
  '0xda7af1118c2c5f2edb0d452a84be91e7b47014cb': {
    name: 'Currency Converter API',
    image: 'https://www.currencyconverterapi.com/images/logo.png',
  },
  '0xda7a238d208eda262505d43678b7d7f180a9ee69': {
    name: 'Rates API',
    image: 'https://ratesapi.io/images/support.png',
  },
  '0xda7ae92ef9089f9093e9555b6cf2fd3e29e3d6d7': {
    name: 'Financial Modeling Prep',
    image: 'https://i.imgur.com/sroTyfS.png',
  },
  '0xda7aa81514ae2108da300639d46aa399abaefa05': {
    name: 'World Trading Data',
    image:
      'https://www.worldtradingdata.com/assets/main/img/favicons/favicon-96x96.png',
  },
  '0xda7a08e515dab7cec794f804ce2b1c850ff19b7f': {
    name: 'Megamillions',
    image: 'https://www.ialottery.com/images/game-logos/megamillions-large.gif',
  },
  '0xda7a198618105fd301958ca76548ce9ea5d1de42': {
    name: 'Data NY Government',
    image:
      'https://i2.wp.com/www.nysgis.net/wp-content/uploads/2016/09/nyslogo_418x200.png',
  },
  '0xda7ad157eda297c1412bbdbe0e3600670e4560f6': {
    name: 'Powerball',
    image:
      'https://s3.amazonaws.com/cdn.powerball.com/drupal/files/2019-03/Powerball%20Power%20Play_7.png',
  },
  '0xda7aba879e90113d6e950cb1f7908f7b4ca52d8c': {
    name: 'Band Reserved Provider',
    image: 'https://app.kovan.bandprotocol.com/favicon.png',
  },
  '0xda7afdee902a41769479349373ef24d19368a9f1': {
    name: 'Octopus',
    image: Octopus,
  },
  '0xda7afa8f087aa2571276b17dbe45a4097c380eff': {
    name: 'Walrus',
    image: Walrus,
  },
  '0xda7af7ce7bad1454bdb96507fb73b7478a345e3b': {
    name: 'Puma',
    image: Puma,
  },
  '0xda7a1ed9df0cc9dff132d9c3ffc6d76807c14e4b': {
    name: 'Penguin',
    image: Penguin,
  },
  '0xda7a1277d77ffe97628474dce34a903c97822cbb': {
    name: 'Antelope',
    image: Antelope,
  },
  '0xda7a1331bd1d0283bac9bb06a2be0714901c22b0': {
    name: 'Elephant',
    image: Elephant,
  },
  '0xda7a5879fd7956f3869ecd21b6f58b2afdd1a1bc': {
    name: 'USA node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/5b/Greater_coat_of_arms_of_the_United_States.svg',
  },
  '0xda7a5d4f189ccb60ca5c9243348d7086e9ead434': {
    name: 'Panda',
    image: Panda,
  },
  '0xda7a51d45a6fa2c9ed66eb568b9f8ab34f011001': {
    name: 'SEA node',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/49/Seal_of_ASEAN.svg',
  },
  '0xda7a37ee4069b0c885615db532d0bae80b6dff5c': {
    name: 'USA node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/5/5b/Greater_coat_of_arms_of_the_United_States.svg',
  },
  '0xda7a38e5645a01fa62dd3dcc7cf2435665503e3f': {
    name: 'EU node',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
  },
  '0xda7a3e3214cbc27bf5e6bbed3fb6c1779c715d77': {
    name: 'SEA node',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/49/Seal_of_ASEAN.svg',
  },

  '0xb1cf7b512f090957ca886b626fb2be46ba03cbce': {
    name: '0xB1CF7B51....',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
  },
  '0x3430e76d0733e9eb31d7f388fa3ede31e0abf2e3': {
    name: '0x3430E76D....',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg',
  },
  '0xeb7e8970c261f00025672149fdc810e7c7d12112': {
    name: 'Band Protocol',
    image: Band,
  },
  '0x78a9c7af3f7328993c12e4875c7d6f37ba6573d7': {
    name: '0x78A9C7aF....',
    image:
      'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg',
  },
  '0x4b8284a01cc30644344482278ec9a713fc3c0d28': {
    name: '0x4B8284A0....',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
  },
  '0x6f9907cb0574c3515ac68cffb568751db112ac3e': {
    name: '0x6f9907CB....',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg',
  },
  '0xb70af396a557c3625cb1a8f3b52b3d960f4713a6': {
    name: '0xB70af396....',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg',
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
