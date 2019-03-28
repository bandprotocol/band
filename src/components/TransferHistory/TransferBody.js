import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import TransferBodyRender from './TransferBodyRender'

import { loadTransferHistory } from 'actions'
import { transferHistorySelector } from 'selectors/transfer'

const mapStateToProps = (
  state,
  { communityAddress, isAll, currentPage, pageSize },
) => ({
  items: transferHistorySelector(state, {
    address: communityAddress,
    type: isAll,
    page: currentPage,
    pageSize,
  }).toJS(),
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadOrderHistory: isAll =>
    dispatch(loadTransferHistory(communityAddress, isAll)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TransferBodyRender),
)
