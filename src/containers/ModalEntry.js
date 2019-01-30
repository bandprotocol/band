import { connect } from 'react-redux'

import { currentModalSelector } from 'selectors/current'

import ModalEntry from 'components/ModalEntry'

const mapStateToProps = (state, props) => ({
  modalName: currentModalSelector(state),
})

export default connect(mapStateToProps)(ModalEntry)
