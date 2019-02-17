import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { noOrderSelector } from 'selectors/order'

import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { communityAddress, pageSize, isAll }) => ({
  numberOfPages: Math.ceil(
    noOrderSelector(state, {
      address: communityAddress,
      type: isAll,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
