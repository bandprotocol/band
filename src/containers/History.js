import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

// import { historySelector } from 'selectors/communities'

import History from 'components/History'

import { loadOrderHistory } from 'actions'

const mapStatetoProps = (state, props) => ({
  numberOfPages: 200, // waiting for bun to calculate
})

const mapDispatchToProps = (dispatch, { communityName }) => ({
  loadOrderHistory: isAll => dispatch(loadOrderHistory(communityName, isAll)),
})
export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps,
  )(History),
)
