import React from 'react'

import TransferHistoryRender from './TransferHistoryRender'

import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { loadTransferHistory } from 'actions'

class TransferHistory extends React.Component {
  state = {
    currentPage: 1,
  }

  componentDidMount() {
    this.props.loadTransferHistory()
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const { currentPage } = this.state
    const { communityAddress, pageSize } = this.props
    return (
      <TransferHistoryRender
        communityAddress={communityAddress}
        currentPage={currentPage}
        onChangePage={this.onChangePage.bind(this)}
        pageSize={pageSize}
      />
    )
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadTransferHistory: () => dispatch(loadTransferHistory(communityAddress)),
})
export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(TransferHistory),
)
