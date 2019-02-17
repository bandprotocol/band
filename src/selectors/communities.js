import { createSelector } from 'reselect'
import { communitySelector, addressSelector } from 'selectors/basic'

import { Map } from 'immutable'

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
