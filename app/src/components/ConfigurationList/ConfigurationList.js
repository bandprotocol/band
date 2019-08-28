import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ConfigurationListRender from './ConfigurationListRender'
import { parameterByPrefixSelector } from 'selectors/parameter'
import { communityDetailSelector } from 'selectors/communities'
import { loadParameters } from 'actions'

class ConfigurationList extends React.Component {
  componentDidMount() {
    this.props.loadParameters()
  }

  render() {
    return <ConfigurationListRender {...this.props} />
  }
}

const mapStateToProps = (state, { prefix, communityAddress }) => {
  const name = communityDetailSelector(state, {
    address: communityAddress,
  }).get('name')
  //HARDCODE
  const prefixParam = name === 'Web Request Oracle' ? 'web' : 'tcd'

  return {
    linkToParameter: `/community/${communityAddress}/parameters?prefix=${prefixParam}`,
    params: parameterByPrefixSelector(state, {
      type: prefix.replace(/:/g, ''),
      address: communityAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadParameters: () => dispatch(loadParameters(communityAddress)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConfigurationList),
)
