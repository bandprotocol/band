import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'

const parseProps = communities => {
  return communities
    .map((community, name) => community.set('name', name))
    .valueSeq()
    .toJS()
}
const mapStateToProps = (state, props) => ({
  communities: parseProps(communitySelector(state)),
})

const mapDispathToProps = (state, props) => ({})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispathToProps,
  )(CommunityPage),
)
