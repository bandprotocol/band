import React from 'react'
import HistoryRender from './HistoryRender'

export default class History extends React.Component {
  state = {
    selectedOption: { value: 'all', label: 'All Orders' },
  }

  onChange(selectedOption) {
    this.setState({ selectedOption })
    console.log(`Option selected:`, selectedOption)
  }

  render() {
    const options = [
      { value: 'all', label: 'All Orders' },
      { value: 'mine', label: 'My Orders' },
    ]
    const { selectedOption } = this.state

    return (
      <HistoryRender
        items={this.props.items}
        options={options}
        selectedOption={selectedOption}
        onChange={this.onChange.bind(this)}
      />
    )
  }
}
