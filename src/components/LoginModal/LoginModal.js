import { connect } from 'react-redux'

import LoginModalRender from './LoginModalRender'
import { hideModal } from 'actions'

const mapDispatchToProps = (dispatch, props) => ({
  hideLogin: () => dispatch(hideModal()),
})

export default connect(
  null,
  mapDispatchToProps,
)(LoginModalRender)
