import { createSelector } from 'reselect'
import { tokenSelector, addressSelector } from 'selectors/basic'

export const tokenCommSelector = createSelector(
  [tokenSelector, addressSelector],
  (token, address) => {
    if (!token.get(address)) return null
    return token.get(address)
  },
)
