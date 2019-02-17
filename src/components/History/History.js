import React from 'react'

import HistoryRender from './HistoryRender'

import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { loadOrderHistory } from 'actions'

class History extends React.Component {
  state = {
    selectedOption: { value: 'all', label: 'All Orders' },
    currentPage: 1,
  }

  componentDidMount() {
    this.props.loadOrderHistory(this.state.selectedOption.value === 'all')
  }

  componentDidUpdate(_, prevState) {
    if (prevState.selectedOption.value !== this.state.selectedOption.value) {
      this.props.loadOrderHistory(this.state.selectedOption.value === 'all')
    }
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
    const { communityAddress, pageSize } = this.props
    return (
      <HistoryRender
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

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadOrderHistory: isAll => dispatch(loadOrderHistory(communityAddress, isAll)),
})
export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(History),
)
