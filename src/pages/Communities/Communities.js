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
    featureCommunities: [
      '0x35446727c0C4332CA05AC9e2bAA10809c4748479',
      '0x3698856D3bD066D0950F0B11E5f493ec58697563', // TODO: FIX HARDCODE LATER
    ],
  })
    .valueSeq()
    .toJS(),
})

export default withRouter(connect(mapStateToProps)(CommunityPage))
