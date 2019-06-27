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
    },
    'erc20:': {
      image: ERC20,
      label: 'ERC-20 Pairs',
      shortLabel: 'ERC-20',
      order: 2,
    },
    'fx:': {
      image: CommoditySrc,
      label: 'Foreign Exchange',
      shortLabel: 'FX',
      order: 3,
    },
    'useq:': {
      image: StockSrc,
      label: 'US Equities',
      shortLabel: 'US Equities',
      order: 4,
    },
    'nba:': {
      image: BasketballSrc,
      label: 'NBA',
    },
    'mlb:': {
      image: BaseballSrc,
      label: 'MLB',
    },
    'nfl:': {
      image: USAFootballSrc,
      label: 'NFL',
    },
    'epl:': {
      image: SoccerSrc,
      label: 'Soccer',
    },
  }[prefix] || { image: USAFootballSrc, label: 'Unknown' })
