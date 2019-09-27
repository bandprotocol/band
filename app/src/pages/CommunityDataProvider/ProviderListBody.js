import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { showModal } from 'actions'

import ProviderListBodyRender from './ProviderListBodyRender'

import { dataProvidersSelector } from 'selectors/dataProvider'
import { remainingTokenByTCDSelector } from 'selectors/balances'

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  showDepositWithdraw: (
    actionType,
    tcdAddress,
    dataSourceAddress,
    userOwnership,
    userStake,
    stake,
    totalOwnership,
  ) =>
    dispatch(
      showModal('DEPOSITWITHDRAW', {
        actionType,
        tcdAddress,
        dataSourceAddress,
        userOwnership,
        userStake,
        stake,
        totalOwnership,
        tokenAddress,
      }),
    ),
  showConvertRevenue: (
    tcdAddress,
    dataSourceAddress,
    userRevenue,
    stake,
    totalOwnership,
  ) =>
    dispatch(
      showModal('CONVERT_REVENUE', {
        tcdAddress,
        dataSourceAddress,
        userRevenue,
        stake,
        totalOwnership,
      }),
    ),
})

const mapStateToProps = (
  state,
  { tokenAddress, currentPage, pageSize, user, tcdAddress },
) => {
  const remainingToken = remainingTokenByTCDSelector(state, {
    address: tokenAddress,
    tcdAddress,
  })
  const items = dataProvidersSelector(state, {
    address: tokenAddress,
    page: currentPage,
    pageSize,
    tcdAddress,
  })
  /*
    while (items.length < pageSize) {
      items.push(null)
    }
  */
  console.log(items)
  return { user, items, remainingToken }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProviderListBodyRender),
)
