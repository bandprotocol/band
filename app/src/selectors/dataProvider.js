import { createSelector } from 'reselect'
import { List } from 'immutable'
import { getProvider } from 'data/Providers'
import {
  tcdSelector,
  addressSelector,
  pageSelector,
  pageSizeSelector,
  tcdAddressSelector,
} from 'selectors/basic'

export const dataProvidersSelector = createSelector(
  [
    tcdSelector,
    addressSelector,
    pageSelector,
    pageSizeSelector,
    tcdAddressSelector,
  ],
  (tcds, address, page, pageSize, tcdAddress) => {
    const tcdsByComm = tcds.get(address)
    if (
      !tcdsByComm ||
      tcdsByComm.size === 0 ||
      !tcdsByComm.get(tcdAddress) ||
      !tcdsByComm.get(tcdAddress).get('dataProviders')
    )
      return List()
    const tmpTcd = tcdsByComm.get(tcdAddress).toJS()

    return tmpTcd.dataProviders
      .map(dp => ({
        ...dp,
        tcdAddress: tmpTcd.address,
        detail: getProvider(dp.dataSourceAddress).name,
      }))
      .slice((page - 1) * pageSize, page * pageSize)
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
