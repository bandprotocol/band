import React from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { communityDetailSelector } from 'selectors/communities'
import { tokenCommSelector } from 'selectors/token'
import { loadToken } from 'actions'
import CommunityDescriptionRender from 'components/CommunityDescription/CommunityDescriptionRender'

class CommunityDescription extends React.Component {
  state = {
    selectedOption: { value: 'all', label: 'All Orders' },
    currentPage: 1,
  }

  componentDidMount() {
    this.props.loadToken()
  }

  render() {
    return <CommunityDescriptionRender {...this.props} />
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadToken: () => dispatch(loadToken(communityAddress)),
})

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })
  if (!community) return {}
  return {
    name: community.get('name'),
    address: community.get('address'),
    tokenAddr: tokenCommSelector(state, { address: communityAddress }),
    src: community.get('logo'),
    link: community.get('website'),
    organization: community.get('organization'),
    description: community.get('description'),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CommunityDescription),
)
