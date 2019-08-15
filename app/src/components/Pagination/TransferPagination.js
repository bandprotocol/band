import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { numTransferSelector } from 'selectors/transfer'

import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { tokenAddress, pageSize }) => ({
  numberOfPages: Math.ceil(
    numTransferSelector(state, {
      address: tokenAddress,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
