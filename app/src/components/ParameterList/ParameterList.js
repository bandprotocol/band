import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ParameterListRender from './ParameterListRender'
import { parameterByPrefixSelector } from 'selectors/parameter'

const mapStateToProps = (state, { prefix, match }) => ({
  params: parameterByPrefixSelector(state, {
    type: prefix.value,
    address: match.params.community,
  }),
})

export default withRouter(connect(mapStateToProps)(ParameterListRender))
