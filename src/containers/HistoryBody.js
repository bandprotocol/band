import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import HistoryBody from 'components/HistoryBody'

import { loadOrderHistory } from 'actions'
import { orderHistorySelector } from 'selectors/order'

const mapStateToProps = (state, { communityName, isAll }) => ({
  items: orderHistorySelector(state, {
    name: communityName,
    type: isAll,
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
