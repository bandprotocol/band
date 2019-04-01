import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import HistoryBodyRender from './HistoryBodyRender'

import { loadOrderHistory } from 'actions'
import { orderHistorySelector } from 'selectors/order'

const mapStateToProps = (
  state,
  { communityAddress, isAll, currentPage, pageSize },
) => {
  const items = orderHistorySelector(state, {
    address: communityAddress,
    type: isAll,
    page: currentPage,
    pageSize,
  }).toJS()
  while (items.length < pageSize) {
    items.push(null)
  }
  return { items }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadOrderHistory: isAll =>
    dispatch(loadOrderHistory(communityAddress, isAll)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(HistoryBodyRender),
)
