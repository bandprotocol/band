import { createSelector } from 'reselect'
import {
  tcdSelector,
  addressSelector,
  tcdAddressSelector,
} from 'selectors/basic'
import { communityDetailSelector } from 'selectors/communities'

export const tcdsSelector = createSelector(
  [communityDetailSelector, tcdAddressSelector],
  (community, tcdAddress) => {
    if (!community || !community.getIn(['tcds', tcdAddress])) return null
    return community.getIn(['tcds', tcdAddress])
  },
)

export const numDataProviders = createSelector(
  [tcdSelector, addressSelector, tcdAddressSelector],
  (tcds, address, tcdAddress) => {
    if (!tcds.get(address)) return 0
    const tcdsByComm = tcds.get(address)
    if (!tcdsByComm || !tcdsByComm.getIn([tcdAddress, 'dataProviders']))
      return 0

    return tcdsByComm.getIn([tcdAddress, 'dataProviders']).size
  },
)
