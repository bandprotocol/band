import React from 'react'
import OrderHistoryRender from './OrderHistoryRender'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadOrderHistory } from 'actions'
import { noOrderSelector } from 'selectors/order'
import { dispatchAsync } from 'utils/reduxSaga'

class OrderHistory extends React.Component {
  state = {
    currentPage: 1,
    fetching: true,
  }

  async componentDidMount() {
    await this.props.loadOrderHistory()
    this.setState({
      fetching: false,
    })
    this.checker = setInterval(() => {
      this.props.loadOrderHistory()
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
      <OrderHistoryRender
        {...this.state}
        {...this.props}
        onChangePage={this.onChangePage.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  return {
    numOrders: noOrderSelector(state, {
      address: tokenAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  loadOrderHistory: () =>
    dispatchAsync(dispatch, loadOrderHistory(tokenAddress)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OrderHistory),
)
