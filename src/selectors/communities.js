import { createSelector } from 'reselect'
import { communitySelector } from 'selectors/basic'

import { Map } from 'immutable'

export const nameAndAddressCommunitySelector = createSelector(
  communitySelector,
  communities =>
    communities.map((community, name) =>
      Map({
        name,
        address: community.get('address'),
      }),
    ),
)
