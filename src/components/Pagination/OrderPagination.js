import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { noOrderSelector } from 'selectors/order'

import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { communityAddress, pageSize }) => ({
  numberOfPages: Math.ceil(
    noOrderSelector(state, {
      address: communityAddress,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
