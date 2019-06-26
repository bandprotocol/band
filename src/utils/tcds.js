// Sport Image
import BasketballSrc from 'images/basketball.svg'
import SoccerSrc from 'images/basketball.svg'
import USAFootballSrc from 'images/basketball.svg'
import BaseballSrc from 'images/basketball.svg'

export const getTCDInfomation = prefix =>
  ({
    'fiat:': {
      image: BaseballSrc,
      label: 'Fiat',
    },
    'crypto:': {
      image: BasketballSrc,
      label: 'Crypto',
    },
    'stock:': {
      image: SoccerSrc,
      label: 'Stock',
    },
    'commod:': {
      image: USAFootballSrc,
      label: 'Commodity',
    },
  }[prefix] || { image: USAFootballSrc, label: 'Unknown' })
