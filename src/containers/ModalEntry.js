import { connect } from 'react-redux'
import { currentModalSelector } from 'selectors/current'

import { hideModal } from 'actions'

import ModalEntry from 'components/ModalEntry'

const mapStateToProps = state => {
  const modal = currentModalSelector(state)
  if (modal === undefined) return {}
  return {
    modalName: modal.get('name'),
    data: modal.get('data') && modal.get('data').toJS(),
  }
}

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalEntry)
