import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BuySell from 'components/BuySell'

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
  )(BuySell),
)
