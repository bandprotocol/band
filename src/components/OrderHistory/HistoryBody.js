import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import HistoryBodyRender from './HistoryBodyRender'

import { loadOrderHistory } from 'actions'
import { orderHistorySelector } from 'selectors/order'

const mapStateToProps = (
  state,
  { communityAddress, currentPage, pageSize },
) => {
  const items = orderHistorySelector(state, {
    address: communityAddress,
    page: currentPage,
    pageSize,
  }).toJS()
  console.log(items)
  while (items.length < pageSize) {
    items.push(null)
  }
  console.log(items)
  return { items }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadOrderHistory: () => dispatch(loadOrderHistory(communityAddress)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(HistoryBodyRender),
)
