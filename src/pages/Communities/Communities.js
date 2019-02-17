import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'

const mapStateToProps = (state, props) => ({
  communities: communitySelector(state)
    .valueSeq()
    .toJS(),
  bandPrice: bandPriceSelector(state),
})

export default withRouter(connect(mapStateToProps)(CommunityPage))
