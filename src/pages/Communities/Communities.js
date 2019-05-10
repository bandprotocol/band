import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'

const mapStateToProps = (state, props) => ({
  bandPrice: bandPriceSelector(state),
  communities: communitySelector(state)
    .valueSeq()
    .toJS(),
})

export default withRouter(connect(mapStateToProps)(CommunityPage))
