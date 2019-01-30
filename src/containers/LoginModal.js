import { connect } from 'react-redux'

import LoginModal from 'components/LoginModal'
import { hideModal } from 'actions'

const mapDispatchToProps = (dispatch, props) => ({
  hideLogin: () => dispatch(hideModal()),
})

export default connect(
  null,
  mapDispatchToProps,
)(LoginModal)
