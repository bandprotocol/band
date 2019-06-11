import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { numHolders } from 'selectors/holder'

import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { tokenAddress, pageSize }) => ({
  numberOfPages: Math.ceil(
    numHolders(state, {
      address: tokenAddress,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
