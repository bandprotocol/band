// Sport Image
import BasketballSrc from 'images/basketball.svg'
import SoccerSrc from 'images/soccer.svg'
import USAFootballSrc from 'images/football.svg'
import BaseballSrc from 'images/baseball.svg'

// Fiat Image(Inactive)
import ERC20Inactive from 'images/erc20Inactive.svg'
import CrpytoInactive from 'images/cryptoUSDInactive.svg'
import StockInactive from 'images/stockUpInactive.svg'
import FiatInactive from 'images/fiatInactive.svg'

//  Fiat Image(Active)
import ERC20Active from 'images/erc20Active.svg'
import CrpytoActive from 'images/cryptoUSDActive.svg'
import StockActive from 'images/stockUpActive.svg'
import FiatActive from 'images/fiatActive.svg'

export const getTCDInfomation = prefix =>
  ({
    'crypto:': {
      imageActive: CrpytoActive,
      imageInactive: CrpytoInactive,
      label: 'Crypto-Fiat Conversion',
      shortLabel: 'Crypto-Fiat',
      order: 1,
      datapoints: 5,
    },
    'erc20:': {
      imageActive: ERC20Active,
      imageInactive: ERC20Inactive,
      label: 'ERC-20 Pairs',
      shortLabel: 'ERC-20',
      order: 2,
      datapoints: 9,
    },
    'fx:': {
      imageActive: FiatActive,
      imageInactive: FiatInactive,
      label: 'Foreign Exchange',
      shortLabel: 'FX',
      order: 3,
      datapoints: 7,
    },
    'useq:': {
      imageActive: StockActive,
      imageInactive: StockInactive,
      label: 'US Equities',
      shortLabel: 'US Equities',
      order: 4,
      datapoints: 10,
    },
    'nba:': {
      imageInactive: BasketballSrc,
      imageActive: BasketballSrc,
      label: 'NBA',
      shortLabel: 'Basketball',
      order: 1,
    },
    'mlb:': {
      imageInactive: BaseballSrc,
      imageActive: BaseballSrc,
      label: 'MLB',
      shortLabel: 'Baseball',
      order: 2,
    },
    'nfl:': {
      imageInactive: USAFootballSrc,
      imageActive: USAFootballSrc,
      label: 'NFL',
      shortLabel: 'USA Football',
      order: 3,
    },
    'epl:': {
      imageInactive: SoccerSrc,
      imageActive: SoccerSrc,
      label: 'Soccer',
      shortLabel: 'Soccer',
      order: 4,
    },
  }[prefix] || {
    imageActive: USAFootballSrc,
    imageInactive: USAFootballSrc,
    label: 'Unknown',
  })
