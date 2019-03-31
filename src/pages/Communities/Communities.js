import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'
import {
  communityWithBalanceSelector,
  communityFeatureSelector,
} from 'selectors/communities'

const mapStateToProps = (state, props) => ({
  bandPrice: bandPriceSelector(state),
  communities: communitySelector(state)
    .valueSeq()
    .toJS(),
  yourCommunities: communityWithBalanceSelector(state)
    .valueSeq()
    .toJS(),
  featureCommunities: communityFeatureSelector(state, {
    featureCommunities: ['0x6C206e56C74F45E76bed5A76A45550472a8B0634'],
  })
    .valueSeq()
    .toJS(),
})

export default withRouter(connect(mapStateToProps)(CommunityPage))
