import { createSelector } from 'reselect'
import {
  parameterSelector,
  addressSelector,
  typeSelector,
} from 'selectors/basic'

import { Map, List } from 'immutable'

export const prefixListSelector = createSelector(
  [parameterSelector, addressSelector],
  (params, address) =>
    params
      .get(address, Map())
      .keySeq()
      .toJS(),
)

export const parameterByPrefixSelector = createSelector(
  [parameterSelector, addressSelector, typeSelector],
  (params, address, type) => params.getIn([address, type], List()).toJS(),
)
