// Sport Image
import BasketballSrc from 'images/basketball.svg'
import SoccerSrc from 'images/soccer.svg'
import USAFootballSrc from 'images/football.svg'
import BaseballSrc from 'images/baseball.svg'

// Fiat Image
import FiatSrc from 'images/fiat.svg'
import CrpytoSrc from 'images/crypto.svg'
import StockSrc from 'images/stock.svg'
import CommoditySrc from 'images/gold.svg'

export const getTCDInfomation = prefix =>
  ({
    'fiat:': {
      image: FiatSrc,
      label: 'Fiat',
    },
    'crypto:': {
      image: CrpytoSrc,
      label: 'Crypto',
    },
    'useq:': {
      image: StockSrc,
      label: 'USeq',
    },
    'fx:': {
      image: CommoditySrc,
      label: 'Fx',
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
