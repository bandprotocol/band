import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ApplyIdentityModalRender from './ApplyIdentityModalRender'
import { hideModal } from 'actions'

const mapDispatchToProps = (dispatch, props) => ({
  hideModal: () => dispatch(hideModal()),
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(ApplyIdentityModalRender),
)
