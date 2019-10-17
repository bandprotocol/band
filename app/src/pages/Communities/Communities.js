import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'
import { currentUserSelector, currentNetworkSelector } from 'selectors/current'

const mapStateToProps = (state, props) => {
  const communities = communitySelector(state)
    .valueSeq()
    .toJS()

  const user = currentUserSelector(state)
  const currentNetwork = currentNetworkSelector(state)

  return {
    user,
    currentNetwork,
    bandPrice: bandPriceSelector(state),
    tcdCommunities: communities.filter(community => community.tcds),
    tcrCommunities: communities.filter(community => community.tcr),
  }
}

export default withRouter(connect(mapStateToProps)(CommunityPage))
