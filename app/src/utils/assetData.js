export const getAsset = symbol =>
  ({
    BCH: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1831.png',
      label: 'BCH',
    },
    BTC: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1.png',
      label: 'BTC',
    },
    ETH: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1027.png',
      label: 'ETH',
    },
    LTC: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/2.png',
      label: 'LTC',
    },
    XRP: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/52.png',
      label: 'XRP',
    },
    EOS: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1765.png',
      label: 'EOS',
    },
    BAT: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1697.png',
      label: 'BAT',
    },
    LINK: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1975.png',
      label: 'LINK',
    },
    DAI: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/2308.png',
      label: 'DAI',
    },
    MKR: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1518.png',
      label: 'MKR',
    },
    OMG: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1808.png',
      label: 'OMG',
    },
    REP: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1104.png',
      label: 'REP',
    },
    USDC: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/3408.png',
      label: 'USDC',
    },
    ZRX: {
      image: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1896.png',
      label: 'ZRX',
    },
    USD: { image: null, label: 'USD 🇺🇸' },
    CNY: { image: null, label: 'CNY 🇨🇳' },
    EUR: { image: null, label: 'EURO 🇪🇺' },
    GBP: { image: null, label: 'GBP 🇬🇧' },
    JPY: { image: null, label: 'JPY 🇯🇵' },
    THB: { image: null, label: 'THB 🇹🇭' },
    XAG: {
      image:
        'https://gamepedia.cursecdn.com/fortnite_gamepedia/thumb/archive/4/44/20171229204306%21Silver_ore_icon.png/120px-Silver_ore_icon.png?version=f30a42e6b017ee14205e11252774e7a2',
      label: 'Silver',
    },
    XAU: {
      image: 'https://www.svgrepo.com/show/56798/gold.svg',
      label: 'Gold',
    },
  }[symbol] || { image: null, label: symbol })
