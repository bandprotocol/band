import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CommunityDataSetIdentityRender from './CommunityDataSetIdentityRender'
import { showModal } from 'actions'

const mapDispatchToProps = (dispatch, props) => ({
  showApplyIdentity: () => dispatch(showModal('APPLYIDENTITY')),
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(CommunityDataSetIdentityRender),
)
