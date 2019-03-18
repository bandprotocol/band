import { createSelector } from 'reselect'

import {
  proposalSelector,
  typeSelector,
  addressSelector,
} from 'selectors/basic'

import { List } from 'immutable'

export const proposalByStatusSelector = createSelector(
  [proposalSelector, addressSelector, typeSelector],
  (proposals, address, isActive) => {
    if (!proposals.get(address)) return null
    return proposals
      .get(address, List())
      .filter(p => !isActive ^ (p.get('status') === 'NOT_RESOLVED'))
      .sortBy(x => x.get('proposalId'))
      .reverse()
      .toJS()
  },
)
