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
    info: 'This parameter group governs how Crypto-Fiat price feed is provided',
  },
  erc20: {
    info: 'This parameter group governs how ERC-20 price feed is provided',
  },
  fx: {
    info: 'This parameter group governs how FX price feed is provided',
  },
  useq: {
    info: 'This parameter group governs how US Equities price feed is provided',
  },
  pwb: {
    info: 'This parameter group governs how PowerBall lottery feed is provided',
  },
  mmn: {
    info:
      'This parameter group governs how MegaMillion lottery feed is provided',
  },
  epl: {
    info: 'This parameter group governs how Soccer feed is provided',
  },
  nba: {
    info:
      'This parameter group governs how NBA (Basketball) sport feed is provided',
  },
  mlb: {
    info:
      'This parameter group governs how MBL (Baseball) sport feed is provided',
  },
  nfl: {
    info:
      'This parameter group governs how NFL (American Football) sport feed is provided',
  },
  '0xda7adB240Fb99dCD55e19a17B97ac2163d4d4509': {
    info: 'OnchainFX',
  },
  '0xdA7A3C7309Bd2De2e89a554191b2d7c71125186c': {
    info: 'Bancor Protocol',
  },
  tcd: {
    info: 'This parameter group governs how dataset feed is provided.',
  },
  default: { info: 'Unknown' },
}

export const getDescription = prefix =>
  allParametersDescription[prefix] || allParametersDescription.default
