import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import History from 'components/History'

import { loadOrderHistory } from 'actions'

const mapDispatchToProps = (dispatch, { communityName }) => ({
  loadOrderHistory: isAll => dispatch(loadOrderHistory(communityName, isAll)),
})
export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(History),
)
