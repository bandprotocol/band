import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { communityDetailSelector } from 'selectors/communities'

import CommunityDesciption from 'components/CommunityDescription/CommunityDescriptionRender'

const mapStateToProps = (state, { communityName }) => {
  const community = communityDetailSelector(state, { name: communityName })
  if (!community) return {}
  return {
    name: communityName,
    src: community.get('logo'),
    link: community.get('website'),
    author: community.get('author'),
    description: community.get('description'),
  }
}

export default withRouter(connect(mapStateToProps)(CommunityDesciption))
