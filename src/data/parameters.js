// TODO
const allParametersDescription = {
  bonding: {
    info: 'This parameter group dictates how the token bonding curve bahaves',
  },
  params: {
    info:
      'This parameter group dictates how parameter proposals are voted by the community',
  },
  crypto: {
    info: 'ESPN',
  },
  erc20: {
    info: 'Coinbase',
  },
  fx: {
    info: 'Bitstamp',
  },
  useq: {
    info: 'Bitfinex',
  },
  pwb: {
    info: 'Bittrex',
  },
  mmn: {
    info: 'Gemini',
  },
  epl: {
    info: 'Kraken',
  },
  nba: {
    info: 'CoinMarketCap',
  },
  mlb: {
    info: 'CryptoCompare',
  },
  nfl: {
    info: 'OpenMarketCap',
  },
  '0xda7adB240Fb99dCD55e19a17B97ac2163d4d4509': {
    info: 'OnchainFX',
  },
  '0xdA7A3C7309Bd2De2e89a554191b2d7c71125186c': {
    info: 'Bancor Protocol',
  },
  default: { info: 'Unknown' },
}

export const getDescription = prefix =>
  allParametersDescription[prefix] || allParametersDescription.default
