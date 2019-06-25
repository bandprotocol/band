import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ConfigurationListRender from './ConfigurationListRender'
import { parameterByPrefixSelector } from 'selectors/parameter'
import { loadParameters } from 'actions'

class ConfigurationList extends React.Component {
  componentDidMount() {
    this.props.loadParameters()
  }

  render() {
    return <ConfigurationListRender {...this.props} />
  }
}

const mapStateToProps = (state, { prefix, communityAddress }) => ({
  params: parameterByPrefixSelector(state, {
    type: prefix,
    address: communityAddress,
  }),
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadParameters: () => dispatch(loadParameters(communityAddress)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConfigurationList),
)
