import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { numDataProviders } from 'selectors/tcd'

import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { communityAddress, pageSize }) => ({
  numberOfPages: Math.ceil(
    numDataProviders(state, {
      address: communityAddress,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
