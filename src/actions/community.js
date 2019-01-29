export const SAVE_COMMUNITY_INFO = 'SAVE_COMMUNITY_INFO'
export const SAVE_COMMUNITY_CLIENT = 'SAVE_COMMUNITY_CLIENT'

export const saveCommunityInfo = (
  name,
  address,
  logo,
  description,
  website,
) => ({
  type: SAVE_COMMUNITY_INFO,
  name,
  address,
  logo,
  description,
  website,
})

export const saveCommunityClient = (name, client) => ({
  type: SAVE_COMMUNITY_CLIENT,
  name,
  client,
})
