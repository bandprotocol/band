import React from 'react'
import TransferHistoryRender from './TransferHistoryRender'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadTransferHistory } from 'actions'
import { noTransferSelector } from 'selectors/transfer'

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
    const { communityAddress, pageSize, numTransfers } = this.props
    return (
      <TransferHistoryRender
        numTransfers={numTransfers}
        communityAddress={communityAddress}
        currentPage={currentPage}
        onChangePage={this.onChangePage.bind(this)}
        pageSize={pageSize}
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => {
  return {
    numTransfers: noTransferSelector(state, {
      address: communityAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadTransferHistory: () => dispatch(loadTransferHistory(communityAddress)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TransferHistory),
)
