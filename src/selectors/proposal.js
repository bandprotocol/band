import { createSelector } from 'reselect'

import {
  proposalSelector,
  typeSelector,
  addressSelector,
} from 'selectors/basic'

import { List } from 'immutable'

export const proposalByStatusSelector = createSelector(
  [proposalSelector, addressSelector, typeSelector],
  (proposals, address, isActive) =>
    proposals
      .get(address, List())
      .filter(p => !isActive ^ (p.get('status') === 'NOT_RESOLVED'))
      .sortBy(x => x.get('proposalId'))
      .reverse()
      .toJS(),
)
