import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { noTransferSelector } from 'selectors/transfer'

import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { communityAddress, pageSize }) => ({
  numberOfPages: Math.ceil(
    noTransferSelector(state, {
      address: communityAddress,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
