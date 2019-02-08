import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BuySellRender from './BuySellRender'

import { showModal } from 'actions'

const mapDispatchToProps = (dispatch, { communityName }) => ({
  showBuy: () => dispatch(showModal('BUY', { communityName })),
  showSell: () => dispatch(showModal('SELL', { communityName })),
  communityName,
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(BuySellRender),
)
