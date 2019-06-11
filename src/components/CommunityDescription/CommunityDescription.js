import React from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { communityDetailSelector } from 'selectors/communities'
import CommunityDescriptionRender from 'components/CommunityDescription/CommunityDescriptionRender'

class CommunityDescription extends React.Component {
  state = {
    selectedOption: { value: 'all', label: 'All Orders' },
    currentPage: 1,
  }

  render() {
    return <CommunityDescriptionRender {...this.props} />
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  if (!community) return {}
  return {
    name: community.get('name'),
    banner: community.get('banner'),
    address: community.get('address'),
    tokenAddr: community.get('tokenAddress'),
    src: community.get('logo'),
    link: community.get('website'),
    organization: community.get('organization'),
    description: community.get('description'),
  }
}

export default withRouter(connect(mapStateToProps)(CommunityDescription))
