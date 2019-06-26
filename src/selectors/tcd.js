import { createSelector } from 'reselect'
import { tcdSelector, addressSelector } from 'selectors/basic'
import { communityDetailSelector } from 'selectors/communities'

export const tcdsSelector = createSelector(
  [communityDetailSelector, (_, { tcdAddress }) => tcdAddress],
  (community, tcdAddress) => {
    if (!community.getIn(['tcds', tcdAddress])) return null
    return community.getIn(['tcds', tcdAddress])
  },
)

// export const numTcds = createSelector(
//   [tcdSelector, addressSelector],
//   (tcds, address) => {
//     if (!tcds.get(address)) return 0
//     return tcds.get(address).length
//   },
// )

export const numDataProviders = createSelector(
  [tcdSelector, addressSelector],
  (tcds, address) => {
    if (!tcds.get(address)) return 0
    const tcdsByComm = tcds.get(address)
    if (tcdsByComm.size === 0 || !tcdsByComm.get(0).get('dataProviders'))
      return 0
    const tmpTcd = tcdsByComm.get(0).toJS()
    return tmpTcd.dataProviders.length
  },
)
