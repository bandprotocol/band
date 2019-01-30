import { createSelector } from 'reselect'
import { communitySelector, nameSelector } from 'selectors/basic'

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

export const communityDetailSelector = createSelector(
  [communitySelector, nameSelector],
  (communities, name) => communities.get(name),
)
