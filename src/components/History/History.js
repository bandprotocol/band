import React from 'react'

import HistoryRender from './HistoryRender'

export default class History extends React.Component {
  state = {
    selectedOption: { value: 'all', label: 'All Orders' },
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
    this.setState({ selectedOption })
  }

  render() {
    const options = [
      { value: 'all', label: 'All Orders' },
      { value: 'mine', label: 'My Orders' },
    ]
    const { selectedOption } = this.state

    return (
      <HistoryRender
        options={options}
        selectedOption={selectedOption}
        onChange={this.onChange.bind(this)}
        communityName={this.props.communityName}
      />
    )
  }
}
