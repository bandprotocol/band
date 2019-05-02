import { connect } from 'react-redux'
import BN from 'bn.js'
import { withRouter } from 'react-router-dom'
import { showModal } from 'actions'
import ProviderListBodyRender from './ProviderListBodyRender'

import { dataProvidersSelector } from 'selectors/dataProvider'

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  showDW: (actionType, sourceAddress) =>
    dispatch(showModal('DW', { actionType, sourceAddress, communityAddress })),
})

const mapStateToProps = (
  state,
  { communityAddress, currentPage, pageSize },
) => {
  const items = dataProvidersSelector(state, {
    address: communityAddress,
    page: currentPage,
    pageSize,
  })
    .sort((a, b) => {
      if (a.stake.lt(b.stake)) {
        return 1
      }
      if (a.stake.gt(b.stake)) {
        return -1
      }
      return 0
    })
    .map((item, i) => ({ ...item, rank: i + 1 }))
  while (items.length < pageSize) {
    items.push(null)
  }
  return { items }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProviderListBodyRender),
)
