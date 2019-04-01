import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import TransferBodyRender from './TransferBodyRender'

import { transferHistorySelector } from 'selectors/transfer'

const mapStateToProps = (
  state,
  { communityAddress, currentPage, pageSize },
) => {
  const items = transferHistorySelector(state, {
    address: communityAddress,
    page: currentPage,
    pageSize,
  })
  while (items.length < pageSize) {
    items.push(null)
  }
  return { items }
}

export default withRouter(connect(mapStateToProps)(TransferBodyRender))
