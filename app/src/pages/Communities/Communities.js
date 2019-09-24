import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'
import { showModal } from 'actions'

const mapDispatchToProps = (dispatch, props) => ({
  showClaimXFNModal: () => dispatch(showModal('CLAIM_XFN')),
})

const mapStateToProps = (state, props) => {
  const communities = communitySelector(state)
    .valueSeq()
    .toJS()
  return {
    bandPrice: bandPriceSelector(state),
    tcdCommunities: communities.filter(community => community.tcds),
    tcrCommunities: communities.filter(community => community.tcr),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CommunityPage),
)
