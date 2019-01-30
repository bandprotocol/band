import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'

import Navbar from 'components/Navbar'

import { showModal } from 'actions'

const mapStateToProps = (state, props) => ({
  user: currentUserSelector(state),
  balance: bandBalanceSelector(state),
})

const mapDispatchToProps = (dispatch, props) => ({
  showLogin: () => dispatch(showModal('LOGIN')),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Navbar),
)
