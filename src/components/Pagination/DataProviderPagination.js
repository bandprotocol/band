import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { numDataProviders } from 'selectors/tcd'
import PaginationRender from './PaginationRender'

const mapStateToProps = (state, { tokenAddress, pageSize }) => ({
  numberOfPages: Math.ceil(
    numDataProviders(state, {
      address: tokenAddress,
    }) / pageSize,
  ),
})

export default withRouter(connect(mapStateToProps)(PaginationRender))
