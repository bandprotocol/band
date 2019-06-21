import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'

const mapStateToProps = (state, props) => {
  const communities = communitySelector(state)
    .valueSeq()
    .toJS()
  return {
    bandPrice: bandPriceSelector(state),
    tcdCommunities: communities.filter(community => community.tcd),
    tcrCommunities: communities.filter(community => community.tcr),
  }
}

export default withRouter(connect(mapStateToProps)(CommunityPage))
