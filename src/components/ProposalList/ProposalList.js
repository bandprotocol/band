import React from 'react'
import { connect } from 'react-redux'

import ProposalListRender from './ProposalListRender'
import { currentUserSelector } from 'selectors/current'
import { prefixListSelector } from 'selectors/parameter'
import { loadParameters, showModal } from 'actions'

class ProposalList extends React.Component {
  state = {
    proposals: [
      {
        title: '#Admin',
        description: 'Increase reward',
        status: '',
        expiry: '28/01/2019 07:55',
      },
      {
        title: '#Param',
        description: 'Increase reward',
        status: '',
        expiry: '28/01/2019 07:55',
      },
      {
        title: '#Curve',
        description: 'Increase reward',
        status: 'voted',
        expiry: '28/01/2019 07:55',
      },
    ],
  }

  componentDidMount() {
    // this.props.loadParameters()
  }

  componentDidUpdate(prevProps) {
    // do some update
  }

  render() {
    return <ProposalListRender {...this.props} {...this.state} />
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
)(ProposalList)
