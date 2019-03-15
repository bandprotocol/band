import React from 'react'
import { connect } from 'react-redux'

import ProposalBoxRender from './ProposalBoxRender'
import { currentUserSelector } from 'selectors/current'
import { prefixListSelector } from 'selectors/parameter'
import { loadParameters, showModal } from 'actions'

class ProposalBox extends React.Component {
  state = {
    show: false,
  }

  componentDidMount() {
    // this.props.loadParameters()
  }

  componentDidUpdate(prevProps) {
    // do some update
  }

  toggleShow() {
    this.setState({ show: !this.state.show })
    console.log('click')
  }

  render() {
    return (
      <ProposalBoxRender
        {...this.props}
        {...this.state}
        toggleShow={this.toggleShow.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => ({
  prefixList: prefixListSelector(state, { address: communityAddress }).map(
    prefix => ({ value: prefix, label: prefix }),
  ),
  logedin: !!currentUserSelector(state),
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadParameters: () => dispatch(loadParameters(communityAddress)),
  onSubmit: changes =>
    dispatch(showModal('PROPOSE', { changes, communityAddress })),
  signin: () => dispatch(showModal('LOGIN', {})),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProposalBox)
