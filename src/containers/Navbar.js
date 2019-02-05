import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'
import { bandPriceSelector } from 'selectors/bandPrice'

import Navbar from 'components/Navbar'

import { showModal } from 'actions'

const mapStateToProps = (state, props) => {
  return {
    user: currentUserSelector(state),
    balance: bandBalanceSelector(state),
    price: bandPriceSelector(state),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  showLogin: () => dispatch(showModal('LOGIN')),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Navbar),
)
