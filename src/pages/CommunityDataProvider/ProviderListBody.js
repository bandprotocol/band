import { connect } from 'react-redux'
import BN from 'bn.js'
import { withRouter } from 'react-router-dom'
import { showModal } from 'actions'

import ProviderListBodyRender from './ProviderListBodyRender'

import { dataProvidersSelector } from 'selectors/dataProvider'

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  showDepositWithdraw: (
    actionType,
    tcdAddress,
    dataSourceAddress,
    userOwnership,
    stake,
    totalOwnership,
  ) =>
    dispatch(
      showModal('DEPOSITWITHDRAW', {
        actionType,
        tcdAddress,
        dataSourceAddress,
        userOwnership,
        stake,
        totalOwnership,
        communityAddress,
      }),
    ),
})

const mapStateToProps = (
  state,
  { communityAddress, currentPage, pageSize, user },
) => {
  console.warn('fuuuuuu', { communityAddress, currentPage, pageSize, user })
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
  return { user, items }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProviderListBodyRender),
)
