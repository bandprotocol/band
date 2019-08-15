import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import HistoryBodyRender from './HistoryBodyRender'
import { orderHistorySelector } from 'selectors/order'

const mapStateToProps = (state, { tokenAddress, currentPage, pageSize }) => {
  const items = orderHistorySelector(state, {
    address: tokenAddress,
    page: currentPage,
    pageSize,
  }).toJS()
  while (items.length < pageSize) {
    items.push(null)
  }
  return { items }
}

export default withRouter(connect(mapStateToProps)(HistoryBodyRender))
