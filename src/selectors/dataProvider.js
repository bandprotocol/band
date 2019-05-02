import { createSelector } from 'reselect'
import { List } from 'immutable'
import {
  tcdSelector,
  addressSelector,
  pageSelector,
  pageSizeSelector,
} from 'selectors/basic'

export const dataProvidersSelector = createSelector(
  [tcdSelector, addressSelector, pageSelector, pageSizeSelector],
  (tcds, address, page, pageSize) => {
    const tcdsByComm = tcds.get(address)
    if (!tcdsByComm || tcdsByComm.length === 0 || !tcdsByComm[0].dataProviders)
      return List()
    return tcdsByComm[0].dataProviders.slice(
      (page - 1) * pageSize,
      page * pageSize,
    )
  },
)

export const numDataProviders = createSelector(
  [tcdSelector, addressSelector],
  (tcds, address) => {
    const tcdsByComm = tcds.get(address)
    if (!tcdsByComm || tcdsByComm.length === 0 || !tcdsByComm[0].dataProviders)
      return 0
    return tcdsByComm[0].dataProviders.length
  },
)
