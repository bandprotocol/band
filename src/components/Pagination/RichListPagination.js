import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { numHolders } from 'selectors/holder'

import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { communityAddress, pageSize }) => ({
  numberOfPages: Math.ceil(
    numHolders(state, {
      address: communityAddress,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
