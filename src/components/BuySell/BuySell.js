import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BuySellRender from './BuySellRender'

import { showModal } from 'actions'

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  showBuy: () => dispatch(showModal('BUY', { communityAddress })),
  showSell: () => dispatch(showModal('SELL', { communityAddress })),
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(BuySellRender),
)
