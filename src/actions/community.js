export const SAVE_COMMUNITY_INFO = 'SAVE_COMMUNITY_INFO'
export const SAVE_COMMUNITY_CLIENT = 'SAVE_COMMUNITY_CLIENT'

export const saveCommunityInfo = (
  name,
  symbol,
  tokenAddress,
  organization,
  logo,
  banner,
  description,
  website,
  marketCap,
  price,
  last24Hrs,
  totalSupply,
  collateralEquation,
  tcds,
  tcr,
) => ({
  type: SAVE_COMMUNITY_INFO,
  name,
  symbol,
  tokenAddress,
  organization,
  logo,
  banner,
  description,
  website,
  marketCap,
  price,
  last24Hrs,
  totalSupply,
  collateralEquation,
  tcds,
  tcr,
})

export const saveCommunityClient = (address, client) => ({
  type: SAVE_COMMUNITY_CLIENT,
  address,
  client,
})
