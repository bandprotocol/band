// Sport Image(Active)
import BasketballActive from 'images/basketballActive.svg'
import SoccerActive from 'images/soccerActive.svg'
import USAFootballActive from 'images/footballActive.svg'
import BaseballActive from 'images/baseballActive.svg'

// Sport Image(Inactive)
import BasketballInactive from 'images/basketballInactive.svg'
import SoccerInactive from 'images/soccerInactive.svg'
import USAFootballInactive from 'images/footballInactive.svg'
import BaseballInactive from 'images/baseballInactive.svg'

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

// Lottery Image(Active)
import PWBActive from 'images/pwbActive.svg'
import MMNActive from 'images/mmnActive.svg'

// Lottery Image(Inactive)
import PWBInactive from 'images/pwbInactive.svg'
import MMNInactive from 'images/mmnInactive.svg'

// Web Request
import WebRequestActive from 'images/requestActive.svg'
import WebRequestInactive from 'images/requestInactive.svg'

const getTCDType = communityName =>
  ({
    'Financial Data Feeds': 'prices',
    'Sport Data Feeds': 'sports',
    'Lottery Data Feeds': 'lotteries',
    'Web Request Oracle': 'web_requests',
  }[communityName])

export const getTCDIntegrationURLbyName = communityName =>
  ({
    'Financial Data Feeds':
      'https://developer.bandprotocol.com/datasets/financial-kovan.html',
    'Sport Data Feeds':
      'https://developer.bandprotocol.com/datasets/sport-kovan.html',
    'Lottery Data Feeds':
      'https://developer.bandprotocol.com/datasets/lottery-kovan.html',
    'Web Request Oracle':
      'https://developer.bandprotocol.com/datasets/web-oracle.html',
  }[communityName] ||
  'https://developer.bandprotocol.com/datasets/overview.html')

export const getTCDInfomation = (prefix, communityName) =>
  ({
    'web:': {
      imageActive: WebRequestActive,
      imageInactive: WebRequestInactive,
      label: 'Web Request',
      shortLabel: 'Web',
      order: 1,
      type: 'web_requests',
    },
    'crypto:': {
      imageActive: CrpytoActive,
      imageInactive: CrpytoInactive,
      label: 'Crypto-Fiat Conversion',
      shortLabel: 'Crypto-Fiat',
      order: 1,
      type: 'prices',
    },
    'erc20:': {
      imageActive: ERC20Active,
      imageInactive: ERC20Inactive,
      label: 'ERC-20 Pairs',
      shortLabel: 'ERC-20',
      order: 2,
      type: 'prices',
    },
    'fx:': {
      imageActive: FiatActive,
      imageInactive: FiatInactive,
      label: 'Foreign Exchange',
      shortLabel: 'FX',
      order: 3,
      type: 'prices',
    },
    'useq:': {
      imageActive: StockActive,
      imageInactive: StockInactive,
      label: 'US Equities',
      shortLabel: 'US Equities',
      order: 4,
      type: 'prices',
    },
    'nba:': {
      imageInactive: BasketballInactive,
      imageActive: BasketballActive,
      label: 'NBA',
      shortLabel: 'Basketball',
      order: 1,
      type: 'sports',
    },
    'mlb:': {
      imageInactive: BaseballInactive,
      imageActive: BaseballActive,
      label: 'MLB',
      shortLabel: 'Baseball',
      order: 2,
      type: 'sports',
    },
    'nfl:': {
      imageInactive: USAFootballInactive,
      imageActive: USAFootballActive,
      label: 'NFL',
      shortLabel: 'USA Football',
      order: 3,
      type: 'sports',
    },
    'epl:': {
      imageInactive: SoccerInactive,
      imageActive: SoccerActive,
      label: 'Soccer',
      shortLabel: 'Soccer',
      order: 4,
      type: 'sports',
    },
    'pwb:': {
      imageInactive: PWBInactive,
      imageActive: PWBActive,
      label: 'Powerball',
      shortLabel: 'Powerball',
      order: 1,
      type: 'lotteries',
    },
    'mmn:': {
      imageInactive: MMNInactive,
      imageActive: MMNActive,
      label: 'Megamillions',
      shortLabel: 'Megamillions',
      order: 2,
      type: 'lotteries',
    },
    'tcd:': {
      imageInactive: WebRequestInactive,
      imageActive: WebRequestActive,
      label: communityName,
      shortLabel: communityName,
      type: getTCDType(communityName),
    },
  }[prefix] || {
    imageActive: FiatActive,
    imageInactive: FiatInactive,
    shortLabel: communityName,
    label: communityName,
    type: getTCDType(communityName),
  })
