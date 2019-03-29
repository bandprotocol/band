import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import RichlistBodyRender from './RichlistBodyRender'

import { loadTransferHistory } from 'actions'
import { transferHistorySelector } from 'selectors/transfer'

const mapStateToProps = (
  state,
  { communityAddress, isAll, currentPage, pageSize },
) => ({
  items: transferHistorySelector(state, {
    address: communityAddress,
    page: currentPage,
    pageSize,
  }),
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadOrderHistory: isAll =>
    dispatch(loadTransferHistory(communityAddress, isAll)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RichlistBodyRender),
)
