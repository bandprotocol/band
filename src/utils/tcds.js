// Sport Image
import BasketballSrc from 'images/basketball.svg'
import SoccerSrc from 'images/soccer.svg'
import USAFootballSrc from 'images/football.svg'
import BaseballSrc from 'images/baseball.svg'

// Fiat Image
import ERC20 from 'images/erc20.svg'
import CrpytoSrc from 'images/cryptoUSD.svg'
import StockSrc from 'images/stockUp.svg'
import CommoditySrc from 'images/fiat.svg'

export const getTCDInfomation = prefix =>
  ({
    'crypto:': {
      image: CrpytoSrc,
      label: 'Crypto-Fiat Conversion',
      shortLabel: 'Crypto-Fiat',
      order: 1,
      datapoints: 5,
    },
    'erc20:': {
      image: ERC20,
      label: 'ERC-20 Pairs',
      shortLabel: 'ERC-20',
      order: 2,
      datapoints: 9,
    },
    'fx:': {
      image: CommoditySrc,
      label: 'Foreign Exchange',
      shortLabel: 'FX',
      order: 3,
      datapoints: 7,
    },
    'useq:': {
      image: StockSrc,
      label: 'US Equities',
      shortLabel: 'US Equities',
      order: 4,
      datapoints: 10,
    },
    'nba:': {
      image: BasketballSrc,
      label: 'NBA',
      shortLabel: 'Basketball',
      order: 1,
    },
    'mlb:': {
      image: BaseballSrc,
      label: 'MLB',
      shortLabel: 'Baseball',
      order: 2,
    },
    'nfl:': {
      image: USAFootballSrc,
      label: 'NFL',
      shortLabel: 'USA Football',
      order: 3,
    },
    'epl:': {
      image: SoccerSrc,
      label: 'Soccer',
      shortLabel: 'Soccer',
      order: 4,
    },
  }[prefix] || { image: USAFootballSrc, label: 'Unknown' })
