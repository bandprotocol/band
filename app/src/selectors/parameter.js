import { createSelector } from 'reselect'
import {
  parameterSelector,
  addressSelector,
  typeSelector,
  nameSelector,
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
  (params, address, type) =>
    params
      .getIn([address, type], List())
      .sortBy(param => param.get('name'))
      .toJS(),
)

export const parameterByNameSelector = createSelector(
  [parameterByPrefixSelector, nameSelector],
  (params, name) => {
    const parameter = params.filter(param => param.name === name)
    if (parameter.length === 0) return null
    else return parameter[0].value
  },
)
