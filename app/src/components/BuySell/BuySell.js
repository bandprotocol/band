import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BuySellRender from './BuySellRender'

import { showModal } from 'actions'

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  showBuy: () => dispatch(showModal('BUY', { tokenAddress })),
  showSell: () => dispatch(showModal('SELL', { tokenAddress })),
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(BuySellRender),
)
