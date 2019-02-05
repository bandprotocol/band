import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'

const parseProps = communities => {
  return communities
    .map((community, name) => community.set('name', name))
    .valueSeq()
    .toJS()
}
const mapStateToProps = (state, props) => ({
  communities: parseProps(communitySelector(state)),
  bandPrice: bandPriceSelector(state),
})

export default withRouter(connect(mapStateToProps)(CommunityPage))
