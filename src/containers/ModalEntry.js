import { connect } from 'react-redux'

import { currentModalSelector } from 'selectors/current'

import ModalEntry from 'components/ModalEntry'

const mapStateToProps = (state, props) => {
  const modal = currentModalSelector(state)
  if (modal === undefined) return {}
  return {
    modalName: modal.get('name'),
    communityName: modal.get('community'),
  }
}

export default connect(mapStateToProps)(ModalEntry)
