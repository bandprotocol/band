export const SAVE_COMMUNITY_INFO = 'SAVE_COMMUNITY_INFO'
export const SAVE_COMMUNITY_CLIENT = 'SAVE_COMMUNITY_CLIENT'

export const saveCommunityInfo = (
  name,
  address,
  author,
  logo,
  description,
  website,
  marketCap,
  price,
  last24Hrs,
) => ({
  type: SAVE_COMMUNITY_INFO,
  name,
  address,
  author,
  logo,
  description,
  website,
  marketCap,
  price,
  last24Hrs,
})

export const saveCommunityClient = (name, client) => ({
  type: SAVE_COMMUNITY_CLIENT,
  name,
  client,
})
