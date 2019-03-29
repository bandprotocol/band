import { createSelector } from 'reselect'
import {
  communitySelector,
  addressSelector,
  featureCommunitiesSelector,
} from 'selectors/basic'

import { Map } from 'immutable'
import BN from 'utils/bignumber'

export const nameAndAddressCommunitySelector = createSelector(
  communitySelector,
  communities =>
    communities.map((community, address) =>
      Map({
        name: community.name,
        address,
      }),
    ),
)

export const communityDetailSelector = createSelector(
  [communitySelector, addressSelector],
  (communities, address) => communities.get(address),
)

export const communitySymbolSelector = createSelector(
  communityDetailSelector,
  community => community && community.get('symbol'),
)

export const communityWithBalanceSelector = createSelector(
  [communitySelector],
  communities =>
    communities.filter(
      community => community.get('balance', new BN(0)).toString() !== '0',
    ),
)

export const communityFeatureSelector = createSelector(
  [communitySelector, featureCommunitiesSelector],
  (communities, featureCommunities) =>
    communities.filter(community =>
      featureCommunities.includes(community.get('address', null)),
    ),
)
