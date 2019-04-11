import React from 'react'

import OrderHistoryRender from './OrderHistoryRender'

import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { loadOrderHistory } from 'actions'

import { noOrderSelector } from 'selectors/order'

class OrderHistory extends React.Component {
  state = {
    currentPage: 1,
  }

  componentDidMount() {
    this.props.loadOrderHistory()
  }

  onChange(selectedOption) {
    if (selectedOption.value !== this.state.selectedOption.value)
      this.setState({ selectedOption, currentPage: 1 })
    else this.setState({ selectedOption })
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const options = [
      { value: 'all', label: 'All Orders' },
      { value: 'mine', label: 'My Orders' },
    ]
    const { selectedOption, currentPage } = this.state
    const { communityAddress, pageSize, numOrders } = this.props
    return (
      <OrderHistoryRender
        numOrders={numOrders}
        options={options}
        selectedOption={selectedOption}
        onChange={this.onChange.bind(this)}
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
    numOrders: noOrderSelector(state, {
      address: communityAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadOrderHistory: () => dispatch(loadOrderHistory(communityAddress)),
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OrderHistory),
)
