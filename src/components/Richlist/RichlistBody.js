import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import RichlistBodyRender from './RichlistBodyRender'

import { loadHolders } from 'actions'
import { holdersSelector } from 'selectors/holder'

const mapStateToProps = (
  state,
  { communityAddress, currentPage, pageSize },
) => ({
  items: holdersSelector(state, {
    address: communityAddress,
    page: currentPage,
    pageSize,
  }),
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadHolders: () => dispatch(loadHolders(communityAddress)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RichlistBodyRender),
)
