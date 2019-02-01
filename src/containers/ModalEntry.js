import { connect } from 'react-redux'

import { currentModalSelector } from 'selectors/current'

import { hideModal } from 'actions'

import ModalEntry from 'components/ModalEntry'

const mapStateToProps = (state, props) => {
  const modal = currentModalSelector(state)
  if (modal === undefined) return {}
  return {
    modalName: modal.get('name'),
    communityName: modal.get('community'),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideModal: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalEntry)
