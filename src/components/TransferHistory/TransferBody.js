import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import TransferBodyRender from './TransferBodyRender'

import { transferHistorySelector } from 'selectors/transfer'

const mapStateToProps = (
  state,
  { communityAddress, currentPage, pageSize },
) => {
  return {
    items: transferHistorySelector(state, {
      address: communityAddress,
      page: currentPage,
      pageSize,
    }),
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  //   loadOrderHistory: isAll =>
  //     dispatch(loadTransferHistory(communityAddress, isAll)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TransferBodyRender),
)
