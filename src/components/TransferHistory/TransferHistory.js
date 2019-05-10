import React from 'react'
import TransferHistoryRender from './TransferHistoryRender'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadTransferHistory } from 'actions'
import { noTransferSelector } from 'selectors/transfer'
import { dispatchAsync } from 'utils/reduxSaga'

class TransferHistory extends React.Component {
  state = {
    currentPage: 1,
    fetching: true,
  }

  async componentDidMount() {
    await this.props.loadTransferHistory()
    this.setState({
      fetching: false,
    })
    this.checker = setInterval(() => {
      this.props.loadTransferHistory()
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.checker)
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    return (
      <TransferHistoryRender
        {...this.props}
        {...this.state}
        onChangePage={this.onChangePage.bind(this)}
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
  loadTransferHistory: () =>
    dispatchAsync(dispatch, loadTransferHistory(communityAddress)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TransferHistory),
)
