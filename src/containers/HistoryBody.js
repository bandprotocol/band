import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import HistoryBody from 'components/HistoryBody'

import { loadOrderHistory } from 'actions'
import { orderHistorySelector } from 'selectors/order'

const mapStateToProps = (
  state,
  { communityName, isAll, currentPage, pageSize },
) => ({
  items: orderHistorySelector(state, {
    name: communityName,
    type: isAll,
    page: currentPage,
    pageSize,
  }).toJS(),
})

const mapDispatchToProps = (dispatch, { communityName }) => ({
  loadOrderHistory: isAll => dispatch(loadOrderHistory(communityName, isAll)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(HistoryBody),
)
